import os
import requests
import pandas as pd
from jobspy import scrape_jobs
from dotenv import load_dotenv

# Load variables from .env for local testing
load_dotenv()

# Get Adzuna Keys from Environment Variables
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

def fetch_jobs(role, location="india"):
    """
    Tries to scrape jobs from LinkedIn/Indeed. 
    If blocked, falls back to the official Adzuna API.
    """
    
    # --- PLAN A: LIVE SCRAPING (LinkedIn, Indeed, Glassdoor) ---
    try:
        print(f"Plan A: Scraping for {role} in {location}...")
        scraped_df = scrape_jobs(
            site_name=["linkedin", "indeed", "glassdoor"],
            search_term=role,
            location=location,
            results_wanted=12,
            hours_old=72, 
            country_indeed='india'
        )
        
        if not scraped_df.empty:
            # Clean data: handle NaNs and convert to list of dicts
            cleaned_df = scraped_df.fillna("")
            raw_list = cleaned_df.to_dict(orient='records')
            
            # Unify format for Frontend
            final_jobs = []
            for job in raw_list:
                final_jobs.append({
                    "title": job.get("title", ""),
                    "company": job.get("company", ""),
                    "location": job.get("location", ""),
                    "job_url": job.get("job_url", ""),
                    "site": job.get("site", "Scraped")
                })
            print(f"Plan A Success: Found {len(final_jobs)} jobs.")
            return final_jobs

    except Exception as e:
        print(f"Plan A Blocked or Failed: {e}")

    # --- PLAN B: OFFICIAL ADZUNA API FALLBACK ---
    if ADZUNA_APP_ID and ADZUNA_APP_KEY:
        try:
            print("Plan B: Using Adzuna API Fallback...")
            # Adzuna uses 'in' for India
            url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
            params = {
                "app_id": ADZUNA_APP_ID,
                "app_key": ADZUNA_APP_KEY,
                "what": role,
                "where": location,
                "content-type": "application/json"
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            fallback_jobs = []
            for res in data.get('results', []):
                fallback_jobs.append({
                    "title": res.get('title', '').replace('<strong>', '').replace('</strong>', ''),
                    "company": res.get('company', {}).get('display_name', 'Company'),
                    "location": res.get('location', {}).get('display_name', location),
                    "job_url": res.get('redirect_url', ''),
                    "site": "Adzuna (Official)"
                })
            
            print(f"Plan B Success: Found {len(fallback_jobs)} jobs.")
            return fallback_jobs
            
        except Exception as e:
            print(f"Plan B also failed: {e}")
            return []
    else:
        print("Plan B skipped: No Adzuna Credentials found in Environment.")
        return []

# For testing locally:
if __name__ == "__main__":
    test_jobs = fetch_jobs("Python Developer", "Bangalore")
    print(test_jobs)