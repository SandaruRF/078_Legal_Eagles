from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse


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
        
        for field in selection.selectedFields:
            candidate_fields[field] = f"Details about {field} for {candidate} "
        
        candidate_details[candidate] = candidate_fields


    return {
        "message": "Selection received",
        "data": candidate_details
    }

@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")
