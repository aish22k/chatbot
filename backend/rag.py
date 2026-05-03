from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = FAISS.load_local(
    "faiss_index",
    embedding_model,
    allow_dangerous_deserialization=True
)

retriever = vector_store.as_retriever(search_kwargs={"k": 4})

model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.8,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

prompt = ChatPromptTemplate.from_template("""
You are a friendly company chatbot.

Answer ONLY from the context.
If not found, say "I don't know".

Context:
{context}

User: {question}
""")

def get_answer(question):
    docs = retriever.invoke(question)
    
    if not docs:
        return "I don't know"

    context = "\n\n".join(d.page_content for d in docs)

    final_prompt = prompt.invoke({
        "context": context,
        "question": question
    })

    response = model.invoke(final_prompt)
    return response.content
