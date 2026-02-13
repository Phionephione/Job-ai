from groq import Groq

client = Groq(api_key="YOUR_GROQ_API_KEY")

def get_smart_summary(description):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a career assistant. Summarize this job into 3 short bullet points: Key Tech, Primary Responsibility, and Why it's a good fit."
            },
            {
                "role": "user",
                "content": description,
            }
        ],
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content