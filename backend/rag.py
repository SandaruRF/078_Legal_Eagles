import google.generativeai as genai
from langchain.document_loaders.pdf import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from dotenv import load_dotenv
from langchain.vectorstores import Chroma
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate
import os
import shutil


def load_document():
    document_loader = PyPDFDirectoryLoader(DATA_PATH)
    return document_loader.load()

def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1000,
        chunk_overlap = 200,
        length_function = len,
        add_start_index = True,
    )
    chunks = text_splitter.split_documents(documents=documents)
    print(f"Split {len(documents)} page documents into {len(chunks)} chunks.")

    return chunks

def save_to_chroma(chunks: list[Document]):
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    db = Chroma.from_documents(
        chunks, embeddings_model, persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}")

def create_knowledge_base():
    documents = load_document()
    chunks = split_text(documents=documents)
    save_to_chroma(chunks)

def getAnswer(query):

    results = vector_db.similarity_search_with_relevance_scores(query, k=5)

    if(len(results)==0):
        answer = "No results !"

    context_with_metadata = []
    for doc, score in results:
            metadata = doc.metadata
            page_content = doc.page_content
            context_with_metadata.append(f"Metadata: {metadata}\nContent: {page_content}\n\n---\n\n")
        
    context_text = "\n".join(context_with_metadata)

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

    prompt = prompt_template.format(context=context_text, question=query)

    answer = llm.generate_content(prompt)

    return answer.text


load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])

llm = genai.GenerativeModel("gemini-1.5-flash")
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

DATA_PATH = ".\\data"
CHROMA_PATH = ".\\chroma"


PROMPT_TEMPLATE = """
Answer the Question based only on the following context:

{context}

Answer the question based on the above context: 
{question}
Don't mention something like 'based on the provided context' on the answer. Just give me the correct answer without mentioning anything.

Answer template - 
(use point form)
give only two points (to display in a website give me a <ul> template)

topic - summary

Add all important context information provided.
To get candidate name, use metadata provided.
"""

vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings_model)


