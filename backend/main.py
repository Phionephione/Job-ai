import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from scraper import fetch_jobs
from groq import Groq
from dotenv import load_dotenv
import uvicorn

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL_ID = "llama-3.3-70b-versatile"

def optimize_query(role, location):
    try:
        # AI fixes both Job Title and Location in one shot
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": "You are a job search assistant. Fix spelling mistakes in the Job Title and Location. Return ONLY the result in format: Title | Location. Example: 'pyton dev' | 'banglore' -> 'Python Developer | Bangalore'"},
                {"role": "user", "content": f"'{role}' | '{location}'"}
            ],
        )
        res = completion.choices[0].message.content.strip().replace('"', '')
        parts = res.split("|")
        return parts[0].strip(), parts[1].strip() if len(parts) > 1 else location
    except Exception as e:
        print(f"AI Optimization failed: {e}")
        return role, location

@app.get("/search")
async def search(role: str, location: str = "india", job_type: str = "all"):
    # 1. AI fixes both role and location spelling
    opt_role, opt_loc = optimize_query(role, location)
    
    # 2. Search using optimized data
    data = fetch_jobs(opt_role, opt_loc, job_type)
    
    return {
        "jobs": data,
        "corrected_role": opt_role,
        "corrected_location": opt_loc,
        "is_corrected": opt_role.lower() != role.lower() or opt_loc.lower() != location.lower()
    }

@app.get("/assistant/chat")
async def assistant_chat(user_msg: str):
    try:
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=[
                {"role": "system", "content": "You are a professional career assistant. Provide roadmaps and guidance."},
                {"role": "user", "content": user_msg}
            ],
        )
        return {"response": completion.choices[0].message.content}
    except:
        return {"response": "AI Brain is offline."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)