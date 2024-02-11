# from openai import OpenAI
from chroma_db import ChromaDB
import chromadb

import firebase_admin
from firebase_admin import credentials, firestore



from langchain.llms import OpenAI
from langchain.agents import load_tools
from langchain.agents import initialize_agent
import os

def well_being_method(data):
    os.environ["OPENAI_API_KEY"] = "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"

    os.environ["SERPAPI_API_KEY"] = "b8ce139aada0de74a5da361a6cd9510224945ead58fa100ec846870b3468c71a"


    llm = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0.9)
    tools = load_tools(["serpapi"], llm=llm)
    agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)
    agent.run(
"""
You are the user's best friend. Your aim is to analyze your conversation with the user and provide wellness tips especially related to mental health.

Follow these rules:
- You can share exercise, yoga, breathing tips. You can share other blogs on how people handled whatever user is going through.
- Do not share anything inappropriate, such as related to weapons, pornography, or suicidal content.

Here is the conversation - {data}
""")
    return agent.agent.history




def collection_based_well_being(collection_name):
    chroma = ChromaDB(collection_name) 

    msgs = chroma.get_recent_messages(15)

    data = '\n'.join([f"{msg['role']}: {msg['content']}" for msg in msgs])

    well_being = well_being_method(data)

    return well_being
    
def main():
    cred = credentials.Certificate("hacklyi-firebase-adminsdk-fnr1a-4e153e277e.json")
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    chroma_client = chromadb.HttpClient(host='34.127.82.55', port=8000)
    all_collections = chroma_client.list_collections()

    user_wise_todo = {}

    for collection in all_collections:
        user_wise_todo[collection.name] = collection_based_well_being(collection.name)

        # Corrected the document path and data to be stored in Firestore
        db.document(f"{collection.name}/02112024").set({"well_being": user_wise_todo[collection.name]})    
