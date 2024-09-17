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

load_dotenv()

genai.configure(api_key=os.environ["API_KEY"])

llm = genai.GenerativeModel("gemini-1.5-flash")
embeddings_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

DATA_PATH = "data"
CHROMA_PATH = "chroma"

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

def getAnswer(query, candidate, field):

    results = vector_db.similarity_search_with_relevance_scores(query, k=10)

    if(len(results)==0):
        answer = "No results !"

    context_with_metadata = []
    for doc, score in results:
            metadata = doc.metadata
            page_content = doc.page_content
            context_with_metadata.append(f"Metadata: {metadata}\nContent: {page_content}\n\n---\n\n")
        
    context_text = "\n".join(context_with_metadata)

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

    prompt = prompt_template.format(context=context_text, candidate=candidate, field=field)

    answer = llm.generate_content(prompt)

    return answer.text

def getSummary(summary_query):
     answer = llm.generate_content(summary_query)
     return answer.text


PROMPT_TEMPLATE = """
Answer the question using only the following context:

{context}

Based on the above context, extract the goals for the candidate and field provided below:

Candidate: {candidate}
Field: {field}

Provide the answer in the following format:
- Use bullet points (HTML <ul> tags) for clarity.
- Limit the points to a maximum of 6.
- Include all relevant details from the context.
- If the provided context does not have specific information on the field for the relevant candidate, try to extract relevant information based on the context.
- If no relevant information can be extracted, provide a single list item: "Unable to find {field} goals from {candidate}'s manifesto."
- Ensure the topic relates to the given field (e.g., school education for the education field).
- Extract the goals for the relevant field from the relevant candidate based on the context.

Answer template:
<ul>
    <li>topic_of_the_point - mini_description</li>
    ...
</ul>
"""




vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings_model)


