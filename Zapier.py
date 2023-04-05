import os
import requests
from time import time


twitter_webhook_url = os.getenv('ZAPIER_TWITTER_WEBHOOK')


def publish_tweet(tweet, timestamp):
    data = {
        "tweet": tweet,
        "unix_timestamp": timestamp if timestamp else int(time())
    }
    response = requests.post(twitter_webhook_url, data).json()
    return response['status']
