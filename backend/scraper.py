import os
import requests
import pandas as pd
from jobspy import scrape_jobs
from dotenv import load_dotenv

load_dotenv()
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

def fetch_jobs(role, location="india", job_type="all"):
    all_results = []
    
    # --- Plan A: Scraper ---
    try:
        search_type = job_type if job_type != "all" else None
        print(f"Scraping: {role} in {location} ({job_type})")
        
        scraped_df = scrape_jobs(
            site_name=["linkedin", "indeed", "glassdoor"],
            search_term=role,
            location=location,
            job_type=search_type, 
            results_wanted=20,
            hours_old=72, 
            country_indeed='india'
        )
        
        if not scraped_df.empty:
            raw_list = scraped_df.fillna("").to_dict(orient='records')
            for job in raw_list:
                all_results.append({
                    "title": job.get("title", ""),
                    "company": job.get("company", ""),
                    "location": job.get("location", ""),
                    "job_url": job.get("job_url", ""),
                    "site": str(job.get("site", "indeed")).lower() 
                })
    except Exception as e:
        print(f"Scraper Plan A Error: {e}")

    # --- Plan B: Adzuna API ---
    if ADZUNA_APP_ID and ADZUNA_APP_KEY:
        try:
            url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
            
            # Internship keyword hack
            search_query = role
            if job_type == "internship":
                search_query = f"{role} internship"

            params = {
                "app_id": ADZUNA_APP_ID,
                "app_key": ADZUNA_APP_KEY,
                "what": search_query,
                "where": location,
                "results_per_page": 15
            }
            if job_type == "fulltime": params["full_time"] = 1

            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            for res in data.get('results', []):
                all_results.append({
                    "title": res.get('title', '').replace('<strong>', '').replace('</strong>', ''),
                    "company": res.get('company', {}).get('display_name', 'Company'),
                    "location": res.get('location', {}).get('display_name', location),
                    "job_url": res.get('redirect_url', ''),
                    "site": "adzuna"
                })
        except Exception as e:
            print(f"Adzuna Plan B Error: {e}")

    return all_results