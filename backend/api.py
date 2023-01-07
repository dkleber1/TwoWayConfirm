from flask import Flask, render_template, request # this is for backend which gives url endpoints
from flask_sqlalchemy import SQLAlchemy # this is for database which stores our messages
from difflib import SequenceMatcher

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///message.sqlite3'
app.config['SECRET_KEY'] = "random string"

db = SQLAlchemy(app)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True) #primary key is the unique field that identifies the object (example index 1 of an array)
    text = db.Column(db.String(200), unique=False, nullable=False)
    hint = db.Column(db.String(200), unique=False, nullable=False)
    threshold = db.Column(db.Integer)
    remaining_guesses = db.Column(db.Integer) #no primary key bc num of remaining guesses can be the same for multiple messages
    def __init__(self, text, hint, threshold, remaining_guesses):
        self.text = text
        self.hint = hint
        self.threshold = threshold
        self.remaining_guesses = remaining_guesses


@app.after_request
def apply_caching(response):
    '''
    Disable CORS in development mode.
    '''
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# the home page, just the url itself
@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/new_message/", methods=['POST'])
def new_message():
    # request.form = {} send message in array and store in index called text
    message_text = request.form['text'] #get user input
    message_hint = request.form['hint'] #get user hint
    message_threshold = int(request.form['threshold'])
    message_guesses = int(request.form['guesses'])
    # checking invalid message guess numbers if people are acessing it manually
    if (message_guesses < -1 or message_guesses > 10):
        message_guesses = -1
    new_message = Message(message_text,message_hint, message_threshold, message_guesses) #create new message object from user input
    db.session.add(new_message) #add new message to database
    db.session.commit() #save database
    return str(new_message.id)

@app.route("/get_message", methods=['GET'])
def get_message():
    message = Message.query.get(int(request.args.get('id'))) #get message from database with id
    if(not message): # the message does not exist
        return "", 404
    if (message.remaining_guesses == 0):
        return "", 204
    return str(message.hint) #return users message hint

@app.route("/guess_message", methods=['POST'])
def guess_message():
    message_guess = request.form['guess'] #get user guess
    message = Message.query.get(int(request.args.get('id'))) #get message from database with id
    print(message.remaining_guesses)
    if (message.remaining_guesses == 0):
        return "", 204
    elif (message.remaining_guesses > 0):
        message.remaining_guesses -= 1


    similarity_ratio = int(100 * SequenceMatcher(None,message.text,message_guess).ratio())
    db.session.commit()
    print(similarity_ratio,message.threshold)

    return str(similarity_ratio >= message.threshold)
    # return str(message.text == message_guess) #return if they are the same

# @app.route("/list")
# def list():
#     print(Message.query.all())
#     return "hi"


with app.app_context():
   db.create_all()
   app.run(debug = True)