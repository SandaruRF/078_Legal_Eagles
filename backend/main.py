from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from rag import getAnswer, getSummary
import pandas as pd
import joblib
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

APIKEY = os.environ['API_KEY_2']
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



test_df = pd.read_csv('model/present_election_dataset1.csv')

model = joblib.load('model/final_percentage_predictor.pkl')

test_predictions = model.predict(test_df[['roberta_pos', 'Poll_data', 'Sentiment_score', 'Election_year', 'Candidate_name_encoded']])

sajithTot=0
sajithCount=0

namalTot=0
namalCount=0

anuraTot=0
anuraCount=0

ranilTot=0
ranilCount=0

for x in range(0,241):
    sajithTot+=test_predictions[x]
    sajithCount+=1

for x in range(241,511):
    namalTot+=test_predictions[x]
    namalCount+=1

for x in range(511,786):
    anuraTot+=test_predictions[x]
    anuraCount+=1

for x in range(786,1070):
    ranilTot+=test_predictions[x]
    ranilCount+=1

sajith=sajithTot/sajithCount
namal=namalTot/namalCount
anura=anuraTot/anuraCount
ranil=ranilTot/ranilCount

tot=sajith+namal+anura+ranil

sajithVal=sajith/tot
namalVal=namal/tot
anuraVal=anura/tot
ranilVal=ranil/tot

class Selection(BaseModel):
    selectedFields: list[str]
    selectedCandidates: list[str]


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/compare")
async def receive_selection(selection: Selection):
    candidate_details = {} 
    summary_details = {}

    for candidate in selection.selectedCandidates:
       
        candidate_fields = {}
        
        if candidate == 'anura':
            name = "Anura Kumara Dissanayake (NPP candidate)"
        elif candidate == 'sajith':
            name = "Sajith Premadasa (SJP candidate)"
        elif candidate == 'ranil':
            name = "Ranil Wickramasinghe"
        else:
            name = "Namal Rajapakshe (SLPP candidate)"

        for field in selection.selectedFields:
            query = f"What are {name}'s goals and plans in the {'security' if field == 'defence' else field} field?"
            answer = getAnswer(query, name, field, candidate)
            candidate_fields[field] = f"{answer}"
        
        candidate_details[candidate] = candidate_fields

    for field in selection.selectedFields:
        summary_query = f"""
        Provide a concise summary and comparison of the {field} goals and plans for all selected candidates based on the context below:
        
        {candidate_details}
        
        Ensure the summary is clear, informative, and effective for comparing the candidates.
        Only extract {field} information from the context.
        Avoid bias and do not suggest support for any candidate.
        Offer a brief comparison between the candidates without using emphatic language or bold formatting.
        Limit the summary to a maximum of 12 sentences.
        """



        summary_details[field] = getSummary(summary_query)

    return {
        "message": "Selection received",
        "data": candidate_details,
        "summary": summary_details
    }

@app.get("/get-values")
async def get_values():   
    return {
        "ranil": ranilVal*100,
        "anura": anuraVal*100,
        "sajith": sajithVal*100,
        "namal": namalVal*100,
    }

@app.get("/chat/{question}")
async def askQuestion(question:str):

    if(question=='Bye' or question=='bye'):
        return {"Answer":"Good Bye"}
    
    result = conversational_rag_chain.invoke(
        {"input": question},
        config={"configurable": {"session_id": "101"}},
    )   

    return {"Answer":result["answer"]}


@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")


