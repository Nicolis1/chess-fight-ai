from http.server import BaseHTTPRequestHandler, HTTPServer
from flask import Flask, request, jsonify
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId, json_util
import os
from dotenv import load_dotenv
from pathlib import Path



dotenv_path = Path('../.env.local')

load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
uri = os.getenv("MONGO_DB_URI")
print(uri)
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

#users
@app.route('/users', methods=['GET'])
def get_all_users():
    users = list(userCollection.find())
    return parse_json(users), 200

@app.route('/users/<item_id>', methods=['GET'])
def get_item(item_id):
    item = userCollection.find_one({'_id': ObjectId(item_id)})
    print(item_id)
    print(list(userCollection.find()))
    print(item)
    if item != None:
        return parse_json(item), 200
    else:
        return parse_json({'error': 'Item not found'}), 404

@app.route('/users/new', methods=['POST'])
def new_user():
    data = request.json
    if data["username"] != None and data["email"] != None and data["password"] != None:
      item_id = userCollection.insert_one({"username":data["username"],"email":data["email"],
                                           "password":data["password"], "bots":[]}).inserted_id
    return parse_json({'message': 'Item added', 'item_id': str(item_id)}), 201


#Bots (maybe should be separate file?)
@app.route('/bots/new/<user_id>', methods=['POST'])
def new_bot(user_id):
    data = request.json
    user = userCollection.find_one({'_id':  ObjectId(user_id)})
    if user != None:
        bot_id = botCollection.insert_one({"username":data["code"], "owner":user_id}).inserted_id
        userCollection.update_one({'_id': ObjectId(user_id)}, {'$push':{"bots":bot_id}})
   
    return parse_json({'message': 'Item added', 'item_id': str(bot_id)}), 201

#Challenges
# here wwe will build the backend for 1:1 challenges, and tournaments

def parse_json(data):
    return jsonify(json_util.dumps(data))

if __name__ == '__main__':
    app.run(debug=True)
