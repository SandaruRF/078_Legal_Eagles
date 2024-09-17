from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from rag import getAnswer, getSummary
import pandas as pd
import joblib


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
            query = f"What are {name}'s goals and plans in the {field} field?"
            answer = getAnswer(query, candidate, field)
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

@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")


