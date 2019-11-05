import os
import sys

originalWD = os.getcwd()
os.chdir(os.path.dirname(os.path.abspath(sys.executable)))

import json
import torch

os.chdir(originalWD)

def main():
    print(json.dumps({
        "type": "cuda_available",
        "data": True
    }), flush=True)

if __name__ == "__main__":
    main()
