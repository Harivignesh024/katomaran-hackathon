import os
import sys
import sqlite3
from dotenv import load_dotenv
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Disable info/debug logging
import logging
logging.basicConfig(level=logging.WARNING)

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from langchain.docstore.document import Document

# Load Groq API key
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
os.environ["OPENAI_API_KEY"] = groq_api_key

# Groq's OpenAI-compatible endpoint
base_url = "https://api.groq.com/openai/v1"

# Load face records from SQLite
conn = sqlite3.connect("../../database/faces.db")
cursor = conn.cursor()
cursor.execute("SELECT name, timestamp FROM faces")
rows = cursor.fetchall()

# Build documents from DB records
docs = [
    Document(page_content=f"{name} was registered at {timestamp}", metadata={"name": name})
    for name, timestamp in rows
]

# Vectorize and search
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(docs, embedding_model)

query = sys.argv[1]
retrieved_docs = vectorstore.similarity_search(query, k=3)
context = "\n".join([doc.page_content for doc in retrieved_docs])

# Set up LLM
llm = ChatOpenAI(
    model="llama3-8b-8192",
    base_url=base_url,
    temperature=0.2
)

# Ask the model
response = llm.invoke([
    HumanMessage(content=f"""Use this context to answer the question:

Context:
{context}

Question:
{query}
""")
])

# Send only the clean final response

print(response.content)

