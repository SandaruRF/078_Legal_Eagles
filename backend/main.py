from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from rag import getAnswer, getSummary

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
            query = f"{name} goals for {field}"
            answer = getAnswer(query)
            candidate_fields[field] = f"{answer}"
        
        candidate_details[candidate] = candidate_fields

    for field in selection.selectedFields:
        summary_query = f"""
        Provide a concise summary of {field} goals for all selected candidates based on {candidate_details}. 
        Ensure the summary is clear, informative, and aids in comparing the candidates effectively.
        Avoid bias and do not suggest voting for any particular candidate.
        Provide a brief comparison between the candidates without using bold words.
        Limit the summary to a maximum of 12 sentences.
        """

        summary_details[field] = getSummary(summary_query)

    return {
        "message": "Selection received",
        "data": candidate_details,
        "summary": summary_details
    }

@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")
