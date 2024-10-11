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
DATA_PATH_NEW_PDF = "uploads"
CHROMA_PATH_NEW_PDF = "chromaforpdf"

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

def save_to_chroma_new_pdf(chunks: list[Document]):
    if os.path.exists(CHROMA_PATH_NEW_PDF):
        shutil.rmtree(CHROMA_PATH_NEW_PDF)

    db = Chroma.from_documents(
        chunks, embeddings_model, persist_directory=CHROMA_PATH_NEW_PDF
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH_NEW_PDF}")

def create_knowledge_base():
    documents = load_document()
    chunks = split_text(documents=documents)
    save_to_chroma(chunks)

def create_knowledge_base_new_pdf():
    documents = load_document(DATA_PATH_NEW_PDF)
    chunks = split_text(documents=documents)
    save_to_chroma_new_pdf(chunks)

def getAnswer(query, candidate, field, name):
    candidates_to_exclude = [
    "Anura Kumara Dissanayake (NPP candidate)",
    "Sajith Premadasa (SJP candidate)",
    "Ranil Wickramasinghe",
    "Namal Rajapakshe (SLPP candidate)"]

    if candidate not in candidates_to_exclude:
        results = vector_db_new_pdf.similarity_search_with_relevance_scores(query, k=15)
    else:
        results = vector_db.similarity_search_with_relevance_scores(query, k=15)

    if(len(results)==0):
        answer = "No results !"

    context_with_metadata = []
    for doc, score in results:
            metadata = doc.metadata
            page_content = doc.page_content
            context_with_metadata.append(f"Metadata: {metadata}\nContent: {page_content}\n\n---\n\n")
        
    context_text = "\n\n".join(context_with_metadata)

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

    prompt = prompt_template.format(context=context_text, candidate=candidate, field=field, name=name)

    answer = llm.generate_content(prompt)

    return answer.text


def compare_news(news, category):
    results = vector_db.similarity_search_with_relevance_scores(f"{category}\n{news}", k=15)

    if(len(results)==0):
        answer = "No results !"

    context_with_metadata = []
    for doc, score in results:
            metadata = doc.metadata
            page_content = doc.page_content
            context_with_metadata.append(f"Metadata: {metadata}\nContent: {page_content}\n\n---\n\n")
    
    context_text = "\n\n".join(context_with_metadata)

    prompt_template = ChatPromptTemplate.from_template(PROMPT_COMPARE_NEWS)

    prompt = prompt_template.format(context=context_text, category=category, news=news)

    answer = llm.generate_content(prompt)

    return answer.text
    
def category_news(news):
    PROMPT_CATEGORY = """
    You are provided with a JSON file containing news articles. This information is for a post-election website, allowing users to assess the performance of their president in Sri Lanka.

    Categories: 
    - Education
    - Agriculture
    - Economy
    - Science and Technology
    - Environment
    - Social Empowerment
    - Energy
    - Defence
    - Tourism
    - Private and Government Sectors
    - Foreign Relationships
    - Politics
    - Transport
    - Health

    Instructions:
    1. Your task is to categorize each news article into one of the specified categories. 
    2. Fill in the category only if the news is relevant to Sri Lanka and its president, Anura Kumara Dissanayake, and can be accurately classified into one of the categories above.
    (Don't categorize news articles such as accidents, weather reports, Nobel prize winners or news that is not appropriate for the Sri Lanka as a country - most focus on President perfomance and government perfomance)
    3. If the news article does not pertain to Sri Lanka or is deemed unimportant, leave the category field as a blank string ('').
    4. Prioritize fitting articles into categories that best reflect their content, rather than defaulting to 'Politics.' Use 'Politics' only if the article is primarily about political matters.
    5. If you cannot categorize a news article, leave the category field as an empty string ('').

    Important - 
    Do not categorize news articles related to accidents, weather reports, Nobel prize winners, or any news that is not relevant to Sri Lanka. Focus primarily on the performance of the president and the government.
    Only categorize government actions that have a positive or negative impact on the people.

    Your final output should be in valid JSON format, maintaining the structure of the provided news articles.
    Output should resemble the following format: (It should convert to JSON using json.loads(your_output_string))
    (Do not add any formatting or extra text beyond the template below)
    (Do not add ```json part, just the below template)
    your_output_string - 

    {
            "articles":[
            {
                "title": "Example Title",
                "description": "Example Description",
                "link": "http://example.com/news",
                "image_url": "http://example.com/images/news.jpg",
                "category": "Relevant Category"
            },
            ...
            ]
    }

    News Articles - 
    """
    prompt = PROMPT_CATEGORY + news
    answer = llm.generate_content(prompt)
    return answer.text


def getSummary(summary_query):
     answer = llm.generate_content(summary_query)
     return answer.text


PROMPT_TEMPLATE = """
Answer the question using only the following context:

{context}

Based on the above context and using the metadata PDF name, extract the goals for the candidate and field provided below:

Candidate (party): {candidate}
Field: {field}
Candidate short name: {name}

Use the metadata PDF name to identify the relevant candidate for each text chunk. Ensure that the extracted information pertains specifically to the given candidate and field. Do not include goals or information relevant to other candidates.

If the provided context does not have specific information on the field for the relevant candidate, try to extract relevant information based on the context of the relevent candidate.
If no relevant information can be extracted, provide a single list item: "Unable to find {field} goals from {name}'s manifesto."

Provide the answer in the following format:
- Use bullet points (HTML <ul> tags) for clarity.
- Limit the points to a maximum of 6.
- Include all relevant details from the context.
- Ensure the topic relates to the mini description of the topic (e.g., school education for the education field).

Answer template:
<ul>
    <li>topic_of_the_point_1 - mini_description</li>
    <li>topic_of_the_point_2 - mini_description</li>
    ...
</ul>
"""

PROMPT_COMPARE_NEWS = """
You're given a post-election news item, the category of that news, and relevant sections of the manifesto. 
The current president is Anura Kumara Dissanayake, so only focus on Anura's manifesto details from the provided parts (use metadata for that).

Your task is to help voters check whether the president is following his manifesto promises. 
First, check if the given news directly aligns with any part of the manifesto. 
If it doesn't, predict how this news could be an action related to a promise made by the president, and explain how it might connect.
Given the manifesto of a presidential candidate and a news article's description, analyze the news article in relation to the candidate's manifesto. 
Indicate whether the news supports the manifesto's goals or contradicts them, without introducing bias. 
Provide a clear label: 'positive' if the news aligns with or supports the manifesto, and 'negative' if the news contradicts or challenges the manifesto. 
Ensure the response is objective, focusing solely on factual comparison."

category - {category}
news - {news}

parts of manifesto with metadata - {context}

Please respond with a maximum of 4  sentences as a paragraph.
"""


vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings_model)
vector_db_new_pdf = Chroma(persist_directory=CHROMA_PATH_NEW_PDF, embedding_function=embeddings_model)


