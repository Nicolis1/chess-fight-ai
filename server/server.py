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
import time
import simulate_challenge



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
    if user_data:
        user = User.from_user_data(user_data)
        return user
    else:
        return None

@app.route('/login', methods=['POST','GET'])
def login():
    username = request.form['username']
    password = request.form['password']
    # I dont think this is actually checking the password
    user_data = userCollection.find_one({'username': username})
    if(user_data and password):
        user = User.from_user_data(user_data)
        if user and user.check_password(password):
            login_user(user)
            flash('Logged in successfully.')
            return redirect('/editor')
        else:
            return redirect('/login/tryagain')
    
    return redirect('/login/tryagain')

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

@app.route('/users/active', methods=['GET'])
def get_active_user():
    if current_user.is_authenticated:
        return parse_json({"username":current_user.username,"userid":current_user.id}), 200
    else:
        return parse_json({"userid": None}), 200

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
    username = request.form['username']
    password = request.form['password']
    confirm = request.form['confirmpassword']

    user_id = uuid4().hex
    if username and password and confirm and password==confirm:
      
        bot_id = uuid4().hex
        userCollection.insert_one({
            "username":username,
            "password":hashpw(password.encode('utf-8'), gensalt()), 
            "bots":[bot_id],
            "userid":user_id
            }).inserted_id
        botCollection.insert_one({"code":"return position.moves()[0];", "owner":user_id, "name":"New Bot",  "botid":bot_id, "challengable":False})
        user = User(username,password,user_id)
        login_user(user)
        flash('created successfully.')
        return redirect('/editor')
    
@app.route('/users/delete', methods=['DELETE'])
@login_required
def delete_user():
    user = current_user.get_id()
    try:
        deleted_ids = botCollection.find({"owner": user}).distinct("botid")
        
        botCollection.delete_many({ "owner":user}).deleted_count
        userCollection.delete_one({"userid":user})
        challengesCollection.update_many({"participants": {"$in": deleted_ids}, "type":"tournament"}, {"$pull":{"participants": {"$in": deleted_ids}}})
        challengesCollection.delete_many({"participants":{"$in": deleted_ids}, "type":"challenge"})
        logout_user()
        return parse_json({'success': "account deleted"}), 200
    
    except:
        return parse_json({'error': "failed to delete"}), 400


#Bots (maybe should be separate file?)
@app.route('/bots/new', methods=['POST'])
@login_required
def new_bot():
    data = request.json
    user_id = current_user.get_id()
    user_data = userCollection.find_one({'userid':  user_id})
    bot_id = uuid4().hex
    defaultName = "New Bot" + str(len(user_data["bots"]))
    if(len(data["name"]) <1):
        name = defaultName
    else:
        name=data["name"]
    if user_data != None:
        botCollection.insert_one({"code":data["code"], "owner":user_id, "name":name,  "botid":bot_id, "challengable":False})
        userCollection.update_one({'userid': user_id}, {'$push':{"bots":bot_id}})
        
    return parse_json({'message': 'bot added', 'bot_id': str(bot_id), 'code':data["code"], "name":name, "challengable":False}), 200

@app.route('/bots/all', methods=['GET'])
@login_required
def get_bots():
    user_id = current_user.get_id()
    user_data = userCollection.find_one({'userid':  user_id})
    if user_data != None:
        queryResult = botCollection.find({"botid": {"$in": user_data["bots"]}})
        results = []
        for doc in queryResult:
            results.append({
                "code":doc["code"],
                "owner":current_user.username,
                "name":doc["name"],
                "botid":doc["botid"],
                "challengable":doc["challengable"],
                
            })
        response = parse_json({"bots":results})
        response.headers['Cache-Control'] = 'max-age=3600'  
        return response, 200
    return parse_json({'error': "no active user"}), 401

@app.route('/bots/delete', methods=['POST'])
@login_required
def delete_bot():
    bot_data = request.json
    modified = 0
    owner = current_user.get_id()
    try:
        modified = botCollection.delete_one({"botid":bot_data["botid"], "owner":owner}).deleted_count
        challengesCollection.update_many({"participants":bot_data["botid"], "type":"tournament"}, {"$pull":{"participants":bot_data["botid"]}})
        challengesCollection.delete_many({"participants":bot_data["botid"], "type":"challenge"})
        userCollection.update_one({"userid":owner},{"$pull":{"bots":bot_data["botid"]}})
        if(modified == 0):
            return parse_json({'message': "nothing modified"}), 204
        else:
            return parse_json({"message": str(modified) +' bots deleted'}), 200
    except:
        return parse_json({'error': "missing data"}), 400

@app.route('/bots/update', methods=['POST'])
@login_required
def update_bot():
    bot_data = request.json
    modified = 0
    owner = current_user.get_id()
    try:
        if bot_data["name"]!=None and bot_data["code"]!=None:
            modified = botCollection.update_one({"botid":bot_data["botid"],"owner":owner},{"$set":{"code":bot_data["code"], "name":bot_data["name"]}}).modified_count
        if(modified == 0):
            return parse_json({'message': "nothing modified"}), 204
        else:
            return parse_json({"message": str(modified) +' bots updated'}), 200
    except:
        return parse_json({'error': "missing data"}), 400
    
@app.route('/bots/update/challenge', methods=['POST'])
@login_required
def update_bot_challenge():
    data = request.json
    modified = 0
    # todo make sure bot is owned by current user
    try:
        if data["challengable"]!=None and data["botid"] != None:
            modified = botCollection.update_one({"botid":data["botid"]},{"$set":{"challengable":data["challengable"]}}).modified_count
        if(modified == 0):
            return parse_json({"message": "nothing modified"}), 204
        else:
            return parse_json({"message": str(modified) +' bots updated'}), 200
    except:
        return parse_json({'error': "missing data"}), 400
    
@app.route('/bots/challengable', methods=['GET'])
def get_challengable():
    user_id = current_user.get_id()
    if(user_id != None):
        results = botCollection.aggregate([ {
                    "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "userid",
                    "as": "userData"
                    }
                },
                {
                    "$match": {
                    "owner": { "$ne": user_id },
                    "challengable":True
                    }
                },
                {
                    "$project": {
                    "_id": 0,
                    "owner": 1, 
                    "code":1,
                    "name":1,
                    "userData.username": 1, 
                    "botid":1,
                    "challengable":1
                }}
                ])
      
    else:
        results = botCollection.find({"challengable": True,"owner":{"$ne":user_id}})
    response = parse_json({"data":results})
 
    return response, 200
    
#Challenges
# here wwe will build the backend for 1:1 challenges, and tournaments
@app.route('/challenges/tournaments/new', methods=['POST'])
@login_required
def new_tourney():
    data = request.json
    user_id = current_user.get_id()     
    if(user_id != "4f7ed09cccc4409d9404235d76e95bc1"):
        return parse_json({'error':'must login as admin'}), 401
    
    challenge_id = uuid4().hex
    challengesCollection.insert_one({"type":"tournament","name":data["name"], "match_data":[], "participants":[], "scheduled":data['time'],  "challengeid":challenge_id})
    return parse_json({'message': 'tournament scheduled', 'challengeid': str(challenge_id), 'scheduled':data['time']}), 200

@app.route('/challenges/tournaments', methods=['GET'])
def get_existing_tournaments():
    now = time.time()
    existing_tournaments = challengesCollection.aggregate([
        {
            "$match": { "type": "tournament",  "scheduled":{ "$gt": (now - 604800) } }
        },
        {
            "$lookup": {
            "from": "bots", 
            "localField": "participants", 
            "foreignField": "botid",
            "as": "participantsData" 
            }
        },
        { 
            "$unwind": {
            "path": "$participantsData",
            "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$lookup": {
            "from": "users", 
            "localField": "participantsData.owner", 
            "foreignField": "userid",
            "as": "userData" 
            }
        },
        {
            "$addFields": {
                "participantData":{
                    "$cond": {
                    "if": { "$eq": [{ "$size": "$userData" }, 0] },
                    "then": "$$REMOVE",
                    "else": {
                        "username":{"$first":"$userData.username"},
                                    "botName":"$participantsData.name",
                                    "code":"$participantsData.code",
                                    "botid":"$participantsData.botid",
                                    "challengable":"$participantsData.challengable"} ,
                    }
                }
            }
        },
        {
            "$group":{
                "_id": "$_id",
                "participantData":{"$push":"$participantData"},
               "type":{"$first":"$type"},
               "challengeid":{"$first":"$challengeid"},
               "scheduled":{"$first":"$scheduled"},
               "match_data":{"$first":"$match_data"},
               "name":{"$first":"$name"},
            }
        },
        { "$sort" : { "scheduled" : 1 } }
    ])

    #todo add logic to return only upcoming and recently finished challenges
    return parse_json({'challenges':existing_tournaments}), 200

@app.route('/challenges/tournaments/join', methods=['POST'])
@login_required
def join_tournament():
    data = request.json
    tournament_to_join = data['tournament']
    bot_id= data['botid']
    bot = botCollection.find_one({"botid": bot_id})
    if(bot["owner"] != current_user.get_id()):
        return parse_json({'error':'only the owner of a bot can add it to a tournament'}), 401
    tournament = challengesCollection.find_one({"challengeid":tournament_to_join})
    if(tournament["scheduled"] < time.time()):
        return parse_json({'message':"failed to join, tournament has passed"}), 400
    if(bot["challengable"] == False):
        return parse_json({'message':"failed to join, bot must be public to join tournaments"}), 400
    if(bot_id in tournament["participants"]):
        return parse_json({'message':"failed to join, bot already registered for this tournamnet"}), 400

    challengesCollection.update_one({'challengeid': tournament_to_join}, {'$push':{"participants":bot_id}})

    
    return parse_json({'message':"successfully joined tournament"}), 200

@app.route('/challenges/direct', methods=['POST'])
@login_required
def direct_challenge():
    # data[botid, opponentbotid]
    data = request.json
    mybot = botCollection.find_one({"botid":data["botid"]})
    opponentBot = botCollection.find_one({"botid":data["opponentid"] })
    if(mybot["owner"] != current_user.get_id()):
        return parse_json({'error':'only the owner of a bot can enter it into challenges'}), 401
    if(opponentBot["owner"] == current_user.get_id()):
        return parse_json({'error':'you can not challenge your own bot'}), 401
    if(opponentBot["challengable"] == False):
        return parse_json({'error':'opponent\'s bot is not challengable'}), 401
    output = simulate_challenge.run_docker_container( mybot["code"], opponentBot["code"], mybot['botid'],opponentBot["botid"],)
    scheduledTime =time.time()
    challenge_id = uuid4().hex
    #todo, only add the output if the result was successful
    challengesCollection.insert_one({"type":"challenge", "creator":current_user.get_id(), "match_data":output, "participants":[mybot["botid"],opponentBot["botid"]], "scheduled":scheduledTime,  "challengeid":challenge_id})
    
    #returns result:{output:{}}, maybe simplify?
    response = parse_json({"result":output.decode('utf-8')})
    return response, 200


@app.route('/challenges/direct', methods=['GET'])
@login_required
def get_challenges_current_user():
    user_id = current_user.get_id()
    now = time.time()
    # matches challenges up to 2 weeks old
    recent_challenges = challengesCollection.aggregate([
        {
            "$match": { "type": "challenge", "scheduled":{ "$gt": (now - 1209600) }  } 
        },
        {
            "$lookup": {
            "from": "bots", 
            "localField": "participants", 
            "foreignField": "botid",
            "as": "participantsData" 
            }
        },
        {
            "$match": {
            "participantsData.owner": user_id
            }
        },
        { 
            "$unwind": {
            "path": "$participantsData",
            "preserveNullAndEmptyArrays": True
            }
        }, 

        {
            "$lookup": {
            "from": "users", 
            "localField": "participantsData.owner", 
            "foreignField": "userid",
            "as": "userData" 
            }
        },
        {
            "$addFields": {
                "participantData":{
                    "$cond": {
                    "if": { "$eq": [{ "$size": "$userData" }, 0] },
                    "then": "$$REMOVE",
                    "else": {
                        "username":{"$first":"$userData.username"},
                                    "botName":"$participantsData.name",
                                    "code":"$participantsData.code",
                                    "botid":"$participantsData.botid",
                                    "challengable":"$participantsData.challengable"} ,
                    }
                }
            }
        },
        {
            "$group":{
                "_id": "$_id",
                "participantData":{"$push":"$participantData"},
               "type":{"$first":"$type"},
               "challengeid":{"$first":"$challengeid"},
               "scheduled":{"$first":"$scheduled"},
               "match_data":{"$first":"$match_data"},
               "name":{"$first":"$name"},
            }
        },
        { "$sort" : { "scheduled" : -1 } }
    ])

    return parse_json({'challenges':recent_challenges}), 200
@app.route('/challenges/direct/all', methods=['GET'])
def get_challenges_all():
    now = time.time()
    recent_challenges = challengesCollection.aggregate([
        {
            "$match": { "type": "challenge", "scheduled":{ "$gt": (now - 1209600) } }
        },
        {
            "$lookup": {
            "from": "bots", 
            "localField": "participants", 
            "foreignField": "botid",
            "as": "participantsData" 
            }
        },
        { 
            "$unwind": {
            "path": "$participantsData",
            "preserveNullAndEmptyArrays": True
            }
        }, 

        {
            "$lookup": {
            "from": "users", 
            "localField": "participantsData.owner", 
            "foreignField": "userid",
            "as": "userData" 
            }
        },
        {
            "$addFields": {
                "participantData":{
                    "$cond": {
                    "if": { "$eq": [{ "$size": "$userData" }, 0] },
                    "then": "$$REMOVE",
                    "else": {
                        "username":{"$first":"$userData.username"},
                                    "botName":"$participantsData.name",
                                    "code":"$participantsData.code",
                                    "botid":"$participantsData.botid",
                                    "challengable":"$participantsData.challengable"} ,
                    }
                }
            }
        },
        {
            "$group":{
                "_id": "$_id",
                "participantData":{"$push":"$participantData"},
               "type":{"$first":"$type"},
               "challengeid":{"$first":"$challengeid"},
               "scheduled":{"$first":"$scheduled"},
               "match_data":{"$first":"$match_data"},
               "name":{"$first":"$name"},
            }
        },
        { "$sort" : { "scheduled" : -1 } }
    ])

    return parse_json({'challenges':recent_challenges}), 200


def parse_json(data):
    return jsonify(json_util.dumps(data))

if __name__ == '__main__':
    app.run(debug=True)
