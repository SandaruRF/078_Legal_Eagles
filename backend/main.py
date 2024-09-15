from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse


class Selection(BaseModel):
    selectedFields: list[str]


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
    print("Received selection:", selection.selectedFields)
    return {"message": "Selection received", "data": selection.selectedFields}

@app.get("/")
async def read_root():
    return HTMLResponse("<h1>Welcome to the FastAPI Backend</h1>")
