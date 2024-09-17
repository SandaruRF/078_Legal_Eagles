from langchain_core.documents import Document
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
import tiktoken
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain


load_dotenv()

APIKEY = os.environ['API_KEY']
llm=ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=APIKEY
)

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


loader = PyPDFDirectoryLoader("Documents")

docs = loader.load()

tokenizer=tiktoken.get_encoding('cl100k_base')
def getTokens(text):
    tokens = tokenizer.encode(text)
    token_length = len(tokens)
    return token_length

token_count = [getTokens(doc.page_content) for doc in docs]

splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=50,
    length_function = len
)

chunks = splitter.split_documents(docs)

print(len(chunks))

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model
)

retriver = vectorstore.as_retriever()

system_prompt = (
    "As you're an intelligent chatbot, use the following context to answer the question."
    "\n\n"
    "{context}"
)

output_parser = StrOutputParser()

contextualize_system_prompt = (
    "using chat history and the latest user question, just reformulate question if needed and otherwise return it as is"
)

contextualize_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)


history_aware_retriever = create_history_aware_retriever(
    llm, retriver, contextualize_prompt
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

qa_chain = create_stuff_documents_chain(llm,prompt)
rag_chain = create_retrieval_chain(history_aware_retriever,qa_chain)

store = {}


def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
)

print("Welcome to the Presidential Election Chatbot.")
print(".............................................")
print("You can Ask any kind of question regarding the Election, Candidates and their Manifestos.")
print("If you want to leave, enter 'Bye'.")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins. You can specify a list of allowed origins here.
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/chat/{question}")
async def askQuestion(question:str):

    if(question=='Bye' or question=='bye'):
        return {"Answer":"Good Bye"}
    
    result = conversational_rag_chain.invoke(
        {"input": question},
        config={"configurable": {"session_id": "101"}},
    )   

    return {"Answer":result["answer"]}
