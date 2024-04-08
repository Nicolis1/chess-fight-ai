import json
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from pathlib import Path
import os
import docker


# dotenv_path = Path('../.env.local')

# load_dotenv(dotenv_path=dotenv_path)
# uri = os.getenv("MONGO_DB_URI")
# client = MongoClient(uri, server_api=ServerApi('1'))
# db = client['chessfight']
# botCollection = db['bots']
# challengesCollection = db['challenges']

# #test connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

#todo add container limit to image build
# container_limits (dict) –

# A dictionary of limits applied to each container created by the build process. Valid keys:

# memory (int): set memory limit for build

# memswap (int): Total memory (memory + swap), -1 to disable
# swap

# cpushares (int): CPU shares (relative weight)

# cpusetcpus (str): CPUs in which to allow execution, e.g.,
# "0-3", "0,1"
def run_docker_container():
    client = docker.from_env()
    imageName = client.images.build(path = "./", tag='fightbots')
    
    container = client.containers.run("fightbots",
                                      cpu_count=1,cpu_rt_period=60000,mem_limit="128m",network_disabled=True,read_only=True, detach=True)
    while True:
        print(container.logs())
    # return container
if __name__ == "__main__":
    run_docker_container()