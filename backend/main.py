import json
import shutil
from typing import List
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from rag import category_news, compare_news, create_knowledge_base_new_pdf, getAnswer, getSummary
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
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from pymongo import DESCENDING
import requests
import feedparser
from bs4 import BeautifulSoup
import pymongo
import asyncio

load_dotenv()

APIKEY = os.environ['API_KEY_2']
llm=ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=APIKEY
)

MONGODB_URL = "mongodb+srv://ex4mp1e:example123@cluster0.k6qa5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
FEED_URL = "https://www.adaderana.lk/rss.php"
UPLOAD_DIRECTORY = "./uploads"


client = AsyncIOMotorClient(MONGODB_URL)

# Define your database and collection
db = client.news
collection = db.politicsNews

# Define Pydantic model
class NewsItem(BaseModel):
    title: str
    description: str = None
    link: str
    image_url: str
    cmp_manifesto: str = None
    category: str = None  # Optional category field


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
    chunk_size=1000,
    chunk_overlap=100,
    length_function = len
)

chunks = splitter.split_documents(docs)

print(len(chunks))

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model
)

retriver = vectorstore.as_retriever(search_kwargs={"k": 10})

system_prompt = (
    """As an intelligent chatbot assisting with information about the 2024 Sri Lanka presidential election, 
    use the following context to answer the question:

    Context:
    {context}

    -end of the context-

    
    If the user asks about anything other than the election, inform them that you are here to answer questions related to the election.
    Do not provide answers on topics outside the scope of the 2024 presidential election.
    Base your answers solely on the context provided.
    Since you are responding to a person, avoid referring to the context's limitations. Focus on delivering relevant information based on the given context.

    Important information:
    - Ranil Wickramasinghe: Individual Candidate
    - Anura Kumara Dissanayake: NPP candidate
    - Sajith Premadasa: SJP candidate
    - Namal Rajapaksha: SLPP candidate
    """
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





test_df = pd.read_csv('model/present_election_dataset1.csv')  #importing the dataset csv file to input to the model

model = joblib.load('model/final_percentage_predictor.pkl') #importing the model

test_predictions = model.predict(test_df[['Poll_data', 'Postal_data', 'Sentiment_score', 'Candidate_Year_encoded']].values)

test_df['predicted_final_percentage'] = test_predictions #adding new colmun with model output to csv file

secondVoteName1=None
secondVoteName2=None
secondVoteVal1=None
secondVoteVal2=None

sajithTot=0
sajithCount=0

namalTot=0
namalCount=0

anuraTot=0
anuraCount=0

ranilTot=0
ranilCount=0

for index, row in test_df.iterrows():
    name=row['Candidate_name']
    value=row['predicted_final_percentage'] 

    if(name=='Sajith'):
        sajithTot+=value
        sajithCount+=1
    if(name=='Ranil'):
        ranilTot+=value
        ranilCount+=1
    if(name=='Anura'):
        anuraTot+=value
        anuraCount+=1
    if(name=='Namal'):
        namalTot+=value
        namalCount+=1

sajithVal=sajithTot/sajithCount
namalVal=namalTot/namalCount
anuraVal=anuraTot/anuraCount
ranilVal=ranilTot/ranilCount

tot=sajithVal+namalVal+anuraVal+ranilVal

sajithP=(sajithVal/tot)*100
namalP=(namalVal/tot)*100
anuraP=(anuraVal/tot)*100
ranilP=(ranilVal/tot)*100

secondVote={'sajith':{'ranil':0.32,'anura':0.29,'namal':0.01},  #details incase a second vite is required (second votes percentages)
            'anura':{'ranil':0.11,'sajith':0.09,'namal':0},
            'ranil':{'sajith':0.35,'anura':0.22,'namal':0.03},
            'namal':{'sajith':0.05,'anura':0.1,'ranil':0.5}
            }

values = {'sajith': sajithP,'namal': namalP,'anura': anuraP,'ranil': ranilP}

sorted_values = sorted(values.items(), key=lambda x: x[1], reverse=True)

#fidning the top two candidates
max1_name, max1_value = sorted_values[0]
max2_name, max2_value = sorted_values[1]

last1_name,last1_value=sorted_values[2]
last2_name,last2_value=sorted_values[3]

def fullName(name):   # fucntion to change name to full name
    if(name=='ranil'):
        return 'Ranil Wickremesinghe'
    if(name=='sajith'):
        return 'Sajith Premadasa'
    if(name=='anura'):
        return 'Anura Kumara'
    if(name=='namal'):
        return 'Namal Rajapaksa'

if(not(max1_value>50)):  #check if any contestent has above 50%
    secondVoteMax1=max1_name  
    secondVoteMax2=max2_name
    secondVoteMaxVal1=max1_value + last1_value*(secondVote[last1_name][secondVoteMax1]) + last2_value*(secondVote[last2_name][secondVoteMax1])
    secondVoteMaxVal2=max2_value + last1_value*(secondVote[last1_name][secondVoteMax2]) + last2_value*(secondVote[last2_name][secondVoteMax2])

    secondVoteMaxVal1=round(secondVoteMaxVal1,3)
    secondVoteMaxVal2=round(secondVoteMaxVal2,3)

    secondVoteMax1=fullName(secondVoteMax1)
    secondVoteMax2=fullName(secondVoteMax2)


sajithP=round(sajithP, 3)
ranilP=round(ranilP, 3)
namalP=round(namalP, 3)
anuraP=round(anuraP, 3)







class Selection(BaseModel):
    selectedFields: list[str]
    selectedCandidates: list[str]

class News(BaseModel):
    title: str
    category: str

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    print(f"Uploaded file:")
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Define the file path (you can hardcode the file name or use a unique name)
    file_path = os.path.join(UPLOAD_DIRECTORY, f"{file.filename}.pdf")

    # Check if a file already exists and remove it
    if os.path.exists(file_path):
        os.remove(file_path)  # Delete the existing file

    # Save the new file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        print(f"Uploaded file: {file.filename}")

    return {"filename": file.filename}


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

        candidates_to_exclude = [
        "Anura Kumara Dissanayake (NPP candidate)",
        "Sajith Premadasa (SJP candidate)",
        "Ranil Wickramasinghe",
        "Namal Rajapakshe (SLPP candidate)"
        ]

        if name not in candidates_to_exclude:
            create_knowledge_base_new_pdf()

        for field in selection.selectedFields:
            query = f"What are {name}'s goals and plans in the {'protection security defence' if field == 'Defense' or field == 'defence' else field} field?"
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


@app.post("/api/newscomp")
async def cmp_news_manifesto(news: News):
    title = news.title
    category = news.category

    # Fetch the news article based on the title
    data = await collection.find_one({"title": title})
    
    # Check if the article exists
    if not data:
        return {"message": "News article not found", "data": None}

    # Prepare the news content
    news_content = f"{title}\n{data['description']}"
    
    # Call the function to compare news with the manifesto
    answer = compare_news(news_content, category)
    
    return {
        "message": "Selection received",
        "data": answer
    }


@app.get("/get-values")
async def get_values():   
    return {
        "ranil": ranilP,
        "anura": anuraP,
        "sajith": sajithP,
        "namal": namalP,
        "secondVoteName1":secondVoteMax1, 
        "secondVoteVal1":secondVoteMaxVal1,
        "secondVoteName2":secondVoteMax2,
        "secondVoteVal2":secondVoteMaxVal2,
    }

@app.get("/chat/{question}")
async def askQuestion(question:str):

    if(question=='Bye' or question=='bye'):
        return {"Answer":"Good Bye"}
    
    question += "\n(If the user asks about anything other than the election, inform them that you are here to answer questions related to the election. Do not provide answers on topics outside the scope of the 2024 presidential election.)"
    result = conversational_rag_chain.invoke(
        {"input": question},
        config={"configurable": {"session_id": "101"}},
    )   

    return {"Answer":result["answer"]}

@app.get("/news", response_model=List[NewsItem])
async def get_news():
    try:
        articles_cursor = collection.find().sort("_id", DESCENDING)
        articles = await articles_cursor.to_list(length=None) 
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Function to extract image link from description (if any)
def extract_image_link(description):
    soup = BeautifulSoup(description, 'html.parser')
    img_tag = soup.find('img')
    return img_tag['src'] if img_tag else None


async def fetch_and_classify_news():
    while True:
        # Fetch the latest news from the RSS feed
        feed = feedparser.parse(FEED_URL)
        new_articles = []  # Initialize as a list

        # Store only new articles to send to LLM
        for entry in feed.entries:
            # Check if the news item already exists in the database
            exists = await collection.count_documents({"title": entry.title, "link": entry.link}) > 0
    
            if not exists:
                # If not in the database, add it to the new_articles list
                article = {
                    "title": entry.title,
                    "description": entry.description,
                    "link": entry.link,
                    "image_url": extract_image_link(entry.description),
                    "category": ""  # Initial blank category
                }
                new_articles.append(article)  # Append to the list

        if not new_articles:
            print("No new articles found.")
        else:
            try:
                formatted_articles = "\n\n".join(
                    [
                        f"Title: {article['title']}\nDescription: {article['description']}\nlink: {article['link']}\nimage_url: {article['image_url']}\ncategory: \"\""
                        for article in new_articles
                    ]
                )
                news = category_news(formatted_articles)  # Await the LLM call
                
                with open('temp.json', 'w', encoding='utf-8') as f:
                    f.write(news)
                
                # Read the articles from temp.json
                with open('temp.json', 'r', encoding='utf-8') as f:
                    temp_data = json.load(f)  # Load the JSON data
                    classified_articles = temp_data['articles']  # Get the articles list

                # Filter out articles with valid categories
                classified_articles = [
                    article for article in classified_articles if article['category']
                ]

                # Store classified articles in MongoDB
                if classified_articles:
                    await collection.insert_many(classified_articles)  # Await the MongoDB insert
                    print(f"Inserted {len(classified_articles)} new articles into MongoDB.")
                else:
                    print("No articles with valid categories found.")
            except Exception as e:
                print(f"Error in processing articles: {e}")

        # Sleep for 1 hour before checking again
        await asyncio.sleep(3600)

@app.on_event("startup")
async def startup_event():
    # Start fetching news in the background
    asyncio.create_task(fetch_and_classify_news())


@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")


