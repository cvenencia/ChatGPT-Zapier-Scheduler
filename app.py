from flask import Flask, render_template, request
import ChatGPT
import Zapier
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/confirmation', methods=['POST'])
def confirmation():
    data = request.get_json()
    tweet = ChatGPT.generate_tweet_from_keywords(*data["keywords"])
    return render_template('confirmation.html', tweet=tweet, **data)


@app.route('/schedule', methods=['POST'])
def schedule():
    data = request.get_json()
    Zapier.publish_tweet(data['tweet'], data['unix_timestamp'])
    return "Success", 200
