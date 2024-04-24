import subprocess

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
def run_docker_container(bot1Code, bot2Code, bot1Id, bot2Id ):
    # client = docker.from_env()
    # client.images.build(path = "./", tag='fightbots')
    
    # arg = "node fightbots.js -bot1=\""+bot1Code+"\" -bot2=\"" +bot2Code +"\"" + " -bot1Id=\""+bot1Id+"\" -bot2Id=\"" +bot2Id +"\""
    
    
    #todo, this is blocking, perhaps will be a perf bottleneck-- 25s response time, very bottleneck
    # logs = client.containers.run("fightbots",arg,
    #                                   cpu_count=1,cpu_rt_period=60000,mem_limit="128m",network_disabled=True,read_only=True)
    

# Define the Node.js command to run
    node_command = ['node', 'fightbots.js', '-bot1='+bot1Code, '-bot2='+bot2Code, '-bot1Id='+bot1Id,'-bot2Id='+bot2Id]

# Run the Node.js command as a subprocess
    result = subprocess.run(node_command, capture_output=True, text=True)
    # Check the return code
    if result.returncode == 0:
        return result.stdout
    else:
        return False
   

