import requests as req
import platform
from subprocess import call

resp = req.get("https://strategy-manager-g2.herokuapp.com/")

print(resp.text)

class Strategy():
    pass

class OracleDB():
    def __init__(self):
        self.system = platform.system()
        self.url = "localhost"
        self.port = "8080"
    
    """
    Execute command (cmd)
    """
    def cmd(self, cmd):
        call(["conn sys/manager as sysdba"])
        call()

def loop():
    pass

def main():
    loop()

if __name__ == "__main__":
    main()