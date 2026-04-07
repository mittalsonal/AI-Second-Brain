from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["second_brain"]

notes_collection = db["notes"]

