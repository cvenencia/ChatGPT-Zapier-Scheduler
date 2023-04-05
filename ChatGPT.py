import os
import openai


openai.api_key = os.getenv('CHATGPT_API_KEY')
CHATGPT_MODEL = "gpt-3.5-turbo"


def generate_tweet_from_keywords(*keywords):
    response = openai.ChatCompletion.create(
        model=CHATGPT_MODEL,
        messages=[
            {
                "role": "system",
                "content": f"""Generate a very short engaging and relevant social media text with no more than 280 characters based on these keywords. Keep it as short as possible.
                ```
                {', '.join(keywords)}
                ```
                """
            },
        ]
    )
    result = ''
    for choice in response.choices:
        result += choice.message.content

    return shorten_less_than_280_characters(result)


def shorten_less_than_280_characters(text):
    if len(text) <= 280:
        return text

    print("SHORTENING: ", text)
    response = openai.ChatCompletion.create(
        model=CHATGPT_MODEL,
        messages=[
            {
                "role": "system",
                "content": f"""Shorten this text to be less than 280 characters long. Do not change the meaning or context
                ```
                {text}
                ```
                """
            },
        ]
    )
    result = ''
    for choice in response.choices:
        result += choice.message.content

    return shorten_less_than_280_characters(result)
