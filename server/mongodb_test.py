from flask import Flask, request, jsonify, flash, redirect, url_for, session
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_login import LoginManager,UserMixin, login_user, logout_user, login_required, current_user
from bcrypt import checkpw, hashpw, gensalt
from bson import ObjectId, json_util
import os
from dotenv import load_dotenv
from pathlib import Path
from uuid import uuid4
import json

dotenv_path = Path('../.env.local')

load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
uri = os.getenv("MONGO_DB_URI")
app.secret_key = os.getenv("SECRET_KEY")

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

client = MongoClient(uri, server_api=ServerApi('1'))
db = client['chessfight']
userCollection = db['users']
botCollection = db['bots']
challengesCollection = db['challenges']

#test connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.route('/')
def index():
    return app.send_static_file('../public/index.html')

#user stuff    
class User(UserMixin):
    def __init__(self, username, password,id):
        self.username = username
        self.password = password
        self.id = id
        self._is_authenticated = True
   
      
    @classmethod
    def from_user_data(self, user_data):
        return User(user_data["username"],user_data["password"],user_data["userid"])
    def get_id(self):
        return self.id
    def check_password(self, password):
        return checkpw(password.encode('utf-8'), self.password)
    def to_json(self):
        return parse_json({"username":self.username, "userid":self.id})
    def toString(self):
        return"username: " + self.username + ", userid: " + self.id  
    @property
    def is_authenticated(self):
        return self._is_authenticated

    @is_authenticated.setter
    def is_authenticated(self, val):
        self._is_authenticated = val


@login_manager.user_loader
def load_user(user_id):
    user_data = userCollection.find_one({'userid': user_id})
    print("\n\n",user_data,"\n\n")
    if user_data:
        user = User.from_user_data(user_data)
        print("\n\n",user.toString(),"\n\n")
        return user
    else:
        return None

@app.route('/login', methods=['POST','GET'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    user_data = userCollection.find_one({'username': username})
    if(user_data and password):
        user = User.from_user_data(user_data)
        if user and user.check_password(password):
            login_user(user)
            flash('Logged in successfully.')
            print(session)
            return redirect('/editor')
    
    return parse_json({'error': 'invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify(**{'result': 200,
                      'data': {'message': 'logout success'}})
    
@app.route('/test', methods=['POST','GET'])
def test():
    return parse_json(current_user)

@app.route('/user_info', methods=['POST'])
@login_required
def user_info():
    print("\n\n\n",current_user.to_json(),"\n\n\n")
    if current_user.is_authenticated:
        return current_user.to_json(), 200
    else:
         return parse_json({'error': 'Item not found'}), 401

#users
@app.route('/users', methods=['GET'])
def get_all_users():
    users = list(userCollection.find())
    return parse_json(users), 200

@app.route('/users/<user_id>', methods=['GET'])
def get_item(user_id):
    user_data = userCollection.find_one({'userid': user_id})
    print(user_data)
   
    if user_data:
        return parse_json(User(user_data['username'], user_data['password'], user_data["userid"]).to_json()),200
    else: 
        return parse_json({'error': 'Item not found'}), 401
      
@app.route('/users/new', methods=['POST'])
def new_user():
    data = request.json
    if data["username"] != None and data["email"] != None and data["password"] != None:
        item_id = userCollection.insert_one({
            "username":data["username"],
            "email":data["email"],
            "password":hashpw(data["password"].encode('utf-8'), gensalt()), 
            "bots":[],
            "userid":uuid4().hex
            }).inserted_id
    return parse_json({'message': 'user added', 'item_id': str(item_id),}), 201




#Bots (maybe should be separate file?)
@app.route('/bots/new', methods=['POST'])
@login_required
def new_bot():
    data = request.json
    user_id = current_user.get_id()
    user_data = userCollection.find_one({'userid':  user_id})
    bot_id = uuid4().hex
    name = "New Bot"
    if user_data != None:
        botCollection.insert_one({"username":data["code"], "owner":user_id, "name":name,  "botid":bot_id})
        userCollection.update_one({'userid': user_id}, {'$push':{"bots":bot_id}})
   
    return parse_json({'message': 'bot added', 'bot_id': str(bot_id), 'code':data["code"], "name":name}), 201

@app.route('/user/bots', methods=['GET'])
@login_required
def get_bots():
    user_id = current_user.get_id()
    user_data = userCollection.find_one({'userid':  user_id})
    if user_data != None:
        # Querying the collection
        results = botCollection.find({"botid": {"$in": user_data["bots"]}})
        return parse_json({"bots":results}), 200
   
    return parse_json({'error': "no active user"}), 401

#Challenges
# here wwe will build the backend for 1:1 challenges, and tournaments

def parse_json(data):
    return jsonify(json_util.dumps(data))

if __name__ == '__main__':
    app.run(debug=True)
