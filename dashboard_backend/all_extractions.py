from openai import OpenAI
from chroma_db import ChromaDB
import chromadb

client = OpenAI()

from langchain.llms import OpenAI
from langchain.agents import load_tools
from langchain.agents import initialize_agent
import os

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


from langchain.llms import OpenAI
from langchain.agents import load_tools
from langchain.agents import initialize_agent
import os

def well_being_method(data):

    llm = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0.9)
    tools = load_tools(["serpapi"], llm=llm)
    agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)
    response = agent.run(
"""
You are the user's best friend. Your aim is to analyze your conversation with the user and provide wellness tips especially related to mental health.

Follow these rules:
- You can share exercise, yoga, breathing tips. You can share other blogs on how people handled whatever user is going through.
- Do not share anything inappropriate, such as related to weapons, pornography, or suicidal content.

Here is the conversation - {data}
""")
    return response

def collection_based_well_being(collection_name):
    chroma = ChromaDB(collection_name) 

    msgs = chroma.get_recent_messages(15)

    data = '\n'.join([f"{msg['role']}: {msg['content']}" for msg in msgs])

    well_being = well_being_method(data)

    return well_being

def suggestions_method(data):
	llm = OpenAI(model_name="gpt-3.5-turbo-instruct", temperature=0.9)
	tools = load_tools(["serpapi"], llm=llm)
	agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)
	response = agent.run(
"""
You are the user's best friend. Your aim is to analyze your conversation with the user and provide helpful suggestions in the form of various links related to topics discussed.

Follow these rules:
- You can share technical links, health-related links, fun links, and food preparation links.
- Do not share anything inappropriate, such as links related to weapons, pornography, or suicidal content.
- Do not share mental health-related links.

Follow the format:
Here are some references to help you finish your to-do list for today:
1. [Link Title](Link)
2. [Link Title](Link)
3. [Link Title](Link)

Here is the conversation - {data}
""")

	return response

def collection_based_suggestions(collection_name):
    chroma = ChromaDB(collection_name) 

    msgs = chroma.get_recent_messages(150)

    data = '\n'.join([f"{msg['role']}: {msg['content']}" for msg in msgs])

    suggestions = suggestions_method(data)

    return suggestions
