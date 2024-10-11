from fastapi import FastAPI, BackgroundTasks
from pymongo import MongoClient
import requests
import feedparser
import asyncio
from pydantic import BaseModel
from bs4 import BeautifulSoup

# Setup FastAPI
app = FastAPI()

# MongoDB setup
client = MongoClient("YOUR_MONGODB_ATLAS_CONNECTION_STRING")  # Replace with your connection string
db = client["news"]
news_collection = db["politicsNews"]

# RSS feed URL
feed_url = "https://www.adaderana.lk/rss.php"

# LLM API details (Assuming you're using an API for classification)
LLM_API_URL = "https://api.gemini15.com/classify"  # Replace with your LLM API URL
headers = {
    "Authorization": "Bearer YOUR_API_KEY",  # Replace with your actual API key
    "Content-Type": "application/json"
}

# Define Pydantic model
class NewsItem(BaseModel):
    title: str
    description: str = None
    link: str
    image_url: str
    cmp_manifesto: str = None
    category: str = None  # Optional category field

# Function to extract the image link from the description
def extract_image_link(description):
    soup = BeautifulSoup(description, 'html.parser')
    img_tag = soup.find('img')
    return img_tag['src'] if img_tag else None

# Function to fetch and classify news
async def fetch_and_classify_news():
    while True:
        # Fetch the latest news from the RSS feed
        feed = feedparser.parse(feed_url)
        articles = []

        for entry in feed.entries:
            article = {
                "title": entry.title,
                "link": entry.link,
                "description": entry.description,
                "published": entry.published,
            }
            articles.append(article)

        # Send news to LLM for classification
        classified_articles = []

        for article in articles:
            data = {"text": article['description']}  # Send description for classification
            response = requests.post(LLM_API_URL, headers=headers, json=data)

            if response.status_code == 200:
                category = response.json().get("category")
                article['category'] = category
                image_link = extract_image_link(article['description'])
                article['image_url'] = image_link

                # Create a NewsItem instance
                news_item = NewsItem(**article)
                classified_articles.append(news_item)

        # Store classified articles in MongoDB
        for item in classified_articles:
            if news_collection.count_documents({"title": item.title, "link": item.link}) == 0:
                news_collection.insert_one(item.dict())
        print(f"Inserted {len(classified_articles)} articles into MongoDB.")

        # Sleep for 1 hour before checking again
        await asyncio.sleep(3600)

# Background task that runs when FastAPI starts
@app.on_event("startup")
async def start_background_tasks():
    asyncio.create_task(fetch_and_classify_news())

# API to get news for the frontend
@app.get("/news")
async def get_news(category: str = None):
    if category:
        articles = await list(news_collection.find({"category": category}))
    else:
        articles = await list(news_collection.find())
    return articles