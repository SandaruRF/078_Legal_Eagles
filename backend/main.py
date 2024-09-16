from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from rag import getAnswer

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

@app.post("/api/endpoint")
async def receive_selection(selection: Selection):
    candidate_details = {} 

    for candidate in selection.selectedCandidates:
       
        candidate_fields = {}
        
        if candidate == 'anura':
            name = "Anura Kumara Dissanayake (akd) (NPP candidate)"
        elif candidate == 'sajith':
            name = "Sajith Premadasa (sp) (SJP candidate)"
        elif candidate == 'ranil':
            name = "Ranil Wickramasinghe (rw)"
        else:
            name = "Namal Rajapakshe (nr) (SLPP candidate)"

        for field in selection.selectedFields:
            query = f"{name} goals for {field}"
            answer = getAnswer(query)
            candidate_fields[field] = f"{answer}"
        
        candidate_details[candidate] = candidate_fields


    return {
        "message": "Selection received",
        "data": candidate_details
    }

@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")
