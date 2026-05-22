import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai

# Setup API Key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=api_key)

app = FastAPI()

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "Higher"

@app.post("/api/generate-question")
async def generate_question(req: QuestionRequest):
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        You are an expert UK GCSE examiner creating realistic exam questions.
        Generate a {req.difficulty} tier GCSE {req.subject} question about {req.topic}.
        
        Adhere strictly to this JSON structure:
        {{
          "subject": "{req.subject}",
          "topic": "{req.topic}",
          "difficulty": "{req.difficulty}",
          "marks": <integer between 1 and 4>,
          "question_text": "<the actual question>",
          "correct_answer": "<the final answer or main concept>"
        }}
        """
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.7,
            )
        )
        
        return json.loads(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
