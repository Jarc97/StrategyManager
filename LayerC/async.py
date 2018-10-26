import asyncio
import requests as req
import json
from subprocess import Popen
import os

def register(id):
    # res = req.get("https://strategy-manager-g2.herokuapp.com/api/new/{}".format(id))
    res = req.get("https://strategy-manager-g2.herokuapp.com/api")
    command = json.loads(res.text)
    print(command)
    print(command[0]['status'])
    
    print(res.text)

def getTask(id):
    # res = req.get("https://strategy-manager-g2.herokuapp.com/api/gettask/{}".format(id))
    res = req.get("http://localhost:5000/api/gettask/{}".format(id))
    command = json.loads(res.text)
    c = command['command']
    print("Current command is: " + c)
    if (c == "backup"):
        print("Executing backup")
        # cwd = os.path.dirname(os.path.realpath(__file__))
        # Popen('backup.bat', cwd='C:\\demo\\')
    return c

def main():
    register("Prueba1")
    getTask("Prueba1")


if __name__ == "__main__":
    main()