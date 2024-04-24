import subprocess
import simulate_challenge

def main():
    # "node fightbots.js -bot1=\"return position.moves()[0]+\" -bot2=\" +return position.moves()[0] +\"" + " -bot1Id=\""+1+"\" -bot2Id=\"" +2 +"\""
    subprocess.check_output(["pwd"],shell=True)
    # subprocess.check_output(["node","fightbots.js", "-bot1=\"return position.moves()[0]\"", "-bot2=\"return position.moves()[0] \"","-bot1Id=1","-bot2Id=2"])
    # thing = simulate_challenge.run_docker_container('return position.moves()[0]','return position.moves()[0]', '1', '2')
    # print(thing)
    import subprocess

# Define the Node.js command to run
node_command = ['node', 'fightbots.js', '-bot1=return position.moves()[0]', '-bot2=return position.moves()[0]', '-bot1Id=1','-bot2Id=2']

# Run the Node.js command as a subprocess
result = subprocess.run(node_command, capture_output=True, text=True)

# Check the return code
if result.returncode == 0:
    print("Node.js command executed successfully")
else:
    print("Error executing Node.js command")
    print("stderr:", result.stderr)

# Print the output
print("stdout:", result.stdout)


