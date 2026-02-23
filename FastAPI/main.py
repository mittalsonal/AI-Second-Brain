from fastapi import FastAPI
from pydantic import BaseModel # basically help in validation
from typing import List

app = FastAPI()

class Tea(BaseModel):
    id : int
    name : str 
    origin : str 

# List will hold the tea objects
teas : List[Tea] = []

@app.get("/") # this '/' is the root endpoint and the decorator @app.get() is used to define a GET endpoint
def read_root():
    return {"message": "Welcome to the Tea API!"}


@app.get("/teas") # this endpoint will return the list of teas
def get_teas():
    return teas

@app.post("/teas") # this endpoint will add a new tea to the list
def add_tea(tea: Tea):
    teas.append(tea)
    return tea


@app.get("/teas/{tea_id}") # this endpoint will return a tea by its id
def update_tea(tea_id: int, updated_tea: Tea):   
    for index, tea in enumerate(teas):
        if tea.id == tea_id:
            teas[index] = updated_tea
            return updated_tea
    return {"error": "Tea not found"}



@app.delete("/teas/{tea_id}") # this endpoint will delete a tea by its id
def delete_tea(tea_id: int):
    for index, tea in enumerate(teas):
        if tea.id == tea_id:
            deleted_tea = teas.pop(index)
            return deleted_tea
    return {"error": "Tea not found"}
