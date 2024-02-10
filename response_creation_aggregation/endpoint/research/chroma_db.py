import chromadb
# from langchain_community.vectorstores import Chroma
# from langchain_openai import OpenAIEmbeddings
import os

# os.environ["OPENAI_API_KEY"] = "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"

class ChromaDB:
	"""docstring for ChromaDB"""
	def __init__(self, user_id):
		super(ChromaDB, self).__init__()
		self.chroma_client = chromadb.HttpClient(host='chroma', port=8000)
		self.collection = self.chroma_client.get_or_create_collection(name=user_id)

		# self.embeddings = OpenAIEmbeddings()

		# self.langchain_chroma = Chroma(
		#     client=self.chroma_client,
		#     collection_name=user_id,
		#     embedding_function=embedding_function,
		# )

	def get_recent_messages(self, rounds=5):
		num_messages = self.collection.count()

		recent_numbers = list(range(max(num_messages - rounds, 0) + 1, num_messages + 1))
		recent_ids = [f'm{num}' for num in recent_numbers]

		recent_messages_dict = self.collection.get(ids = recent_ids)

		ids = recent_messages_dict['ids']
		docs = recent_messages_dict['documents']
		metadatas = recent_messages_dict['metadatas']

		recent_messages = [{'role': metadatas[ids.index(_id)]['role'], 
							'content': docs[ids.index(_id)]} for _id in recent_ids]

		return recent_messages

	def push_latest_message(self, message, role):
		num_messages = self.collection.count()

		self.collection.add(ids=f'm{num_messages + 1}',
							metadatas={'role':role},
							documents=message)

	def get_relevant_messages(self, query_message):
		similar = self.collection.query(query_texts = [query_message],
										n_results = 3)

		ids = similar['ids'][0]
		docs = similar['documents'][0]
		metadatas = similar['metadatas'][0]


		sorted_ids = sorted(ids, key=lambda x: int(''.join(filter(str.isdigit, x))))

		sorted_messages = [{'role':metadatas[ids.index(_id)]['role'],
							'content': docs[ids.index(_id)]} for _id in sorted_ids]

		return sorted_messages		