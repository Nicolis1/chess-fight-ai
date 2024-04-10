import simulate_challenge

def main():
    thing = simulate_challenge.run_docker_container('return position.moves()[0]','return position.moves()[0]', '1', '2')
    print(thing)


main()