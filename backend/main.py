import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jobspy import scrape_jobs
import pandas as pd
from groq import Groq
from dotenv import load_dotenv
import uvicorn

# Load environment variables (API Keys)
load_dotenv()

app = FastAPI(title="AI Unified Job Aggregator API")

# 1. Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your Vercel URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Initialize Groq Client (Free AI)
# Get your key for free at: https://console.groq.com/
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# --- HELPER FUNCTIONS ---

def clean_data(df):
    """Cleans the scraped data for JSON compatibility."""
    # Remove duplicates based on Title and Company Name
    df = df.drop_duplicates(subset=['title', 'company'])
    # Replace NaN values with empty strings (JSON doesn't support NaN)
    return df.fillna("")

# --- API ROUTES ---

@app.get("/")
def health_check():
    return {"status": "online", "message": "Job Aggregator API is running"}

@app.get("/search")
async def search_jobs(
    role: str = Query(..., description="Job role to search"),
    location: str = Query("India", description="Job location"),
    results: int = 15
):
    """
    Scrapes jobs from LinkedIn, Indeed, and Glassdoor simultaneously.
    """
    try:
        # Using JobSpy to fetch data without API keys
        jobs = scrape_jobs(
            site_name=["linkedin", "indeed", "glassdoor"],
            search_term=role,
            location=location,
            results_wanted=results,
            hours_old=72,  # Last 3 days only
            country_indeed='india'
        )

        if jobs.empty:
            return []

        cleaned_jobs = clean_data(jobs)
        # Convert to a list of dictionaries to send to Frontend
        return cleaned_jobs.to_dict(orient='records')

    except Exception as e:
        print(f"Scraper Error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching jobs. Please try again.")

@app.post("/ai-summarize")
async def summarize_job(description: str):
    """
    Uses Llama 3 (via Groq) to summarize a long job description.
    This is the 'Smart Assistant' feature.
    """
    if not GROQ_API_KEY:
        return {"summary": "AI Summarization disabled (No API Key). " + description[:100] + "..."}

    try:
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a professional career assistant. Summarize the following job description into exactly 3 bullet points: 1. Top Skills Needed, 2. Main Responsibility, 3. Estimated Work Culture. Be extremely concise."},
                {"role": "user", "content": description}
            ],
            temperature=0.5,
        )
        return {"summary": completion.choices[0].message.content}
    except Exception as e:
        return {"summary": "Could not generate AI summary."}

@app.get("/assistant/chat")
async def assistant_chat(user_msg: str, user_skills: str = ""):
    """
    Smart Assistant Chat: Suggests job titles based on user's current skills.
    """
    try:
        prompt = f"User message: {user_msg}. User skills: {user_skills}. Suggest 3 specific job titles they should search for."
        
        completion = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a job search assistant. Help the user find specific keywords to search for."},
                {"role": "user", "content": prompt}
            ],
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"response": "I'm having trouble thinking right now. Try searching for 'Software Intern'!"}

# --- RUN THE SERVER ---

if __name__ == "__main__":
    # Run locally on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)