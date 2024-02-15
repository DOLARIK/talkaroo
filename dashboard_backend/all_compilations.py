import firebase_admin
from firebase_admin import credentials, firestore

from all_extractions import *

def main():
    cred = credentials.Certificate("hacklyi-firebase-adminsdk-fnr1a-4e153e277e.json")
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    chroma_client = chromadb.HttpClient(host='34.127.82.55', port=8000)
    all_collections = chroma_client.list_collections()

    user_wise_todo = {}
    user_wise_well_being = {}
    user_wise_suggestions = {}

    for collection in all_collections:
        user_wise_todo[collection.name] = collection_based_todo(collection.name)
        user_wise_well_being[collection.name] = collection_based_well_being(collection.name)
        user_wise_suggestions[collection.name] = collection_based_suggestions(collection.name)

        # Corrected the document path and data to be stored in Firestore
        db.document(f"{collection.name}/02112024").set(
        			{"to_do": user_wise_todo[collection.name],
        			 "well_being": user_wise_well_being[collection.name],
        			 "suggestions": user_wise_suggestions[collection.name]}
        			)