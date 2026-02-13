from jobspy import scrape_jobs

def fetch_jobs(role, location):
    try:
        jobs = scrape_jobs(
            site_name=["linkedin", "indeed", "glassdoor"],
            search_term=role,
            location=location,
            results_wanted=12,
            hours_old=72, 
            country_indeed='india'
        )
        # Convert DataFrame to List of Dicts and handle NaN values
        return jobs.fillna("").to_dict(orient='records')
    except Exception as e:
        print(f"Error: {e}")
        return []