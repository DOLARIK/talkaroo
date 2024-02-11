from openai import OpenAI
from chroma_db import ChromaDB
import chromadb

import firebase_admin
from firebase_admin import credentials, firestore


client = OpenAI(api_key = "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")


def to_do_method(data):
  response = client.chat.completions.create(
    model="gpt-3.5-turbo-0125",
    messages=[
      {
        "role": "system",
        "content": """
You will be given a daily conversation, your task is to abstract a list of things that the user mentioned he/she needs to complete.
Follow these principals while performing this task:

- Keep it simple crsip and accurate
- When giving the suggestions include in the bracket the actual statement where the user mentioned that he needs to complete it.
- Do not give any suggestions from your end.
"""
      },
      {
        "role": "assistant",
        "content": data
      }
    ],
    temperature=0.79,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
  )

  return response.choices[0].message.content

def collection_based_todo(collection_name):
    chroma = ChromaDB(collection_name) 

    msgs = chroma.get_recent_messages(15)

    data = '\n'.join([f"{msg['role']}: {msg['content']}" for msg in msgs])

    todo = to_do_method(data)

    return todo
    
def main():
    cred = credentials.Certificate("hacklyi-firebase-adminsdk-fnr1a-4e153e277e.json")
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    chroma_client = chromadb.HttpClient(host='34.127.82.55', port=8000)
    all_collections = chroma_client.list_collections()

    user_wise_todo = {}

    for collection in all_collections:
        user_wise_todo[collection.name] = collection_based_todo(collection.name)

        # Corrected the document path and data to be stored in Firestore
        db.document(f"{collection.name}/02112024").set({"todo": user_wise_todo[collection.name]})    
