import re
import sys
import json
import platform

import pkg_resources
from pkg_resources import DistributionNotFound, VersionConflict


def formatEntries(entries):
    if not len(entries) == 0:
        formatted = ""
        for i in range(len(entries)):
            if not i + 1 == len(entries):
                formatted += entries[i] + ", "
            else:
                formatted += entries[i]
        return formatted
    else:
        return None


def formatPackage(package):
    return re.split(">=|==", package)[0]


# Define colors for output. This class borrowed from https://stackoverflow.com/a/287944/9710543
class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


# Get required packages from requirements.txt
if platform.system().lower() == "windows":
    required = open("requirements-win32.txt").read().split("\n")
elif platform.system().lower() == 'linux':
    required = open("requirements-linux.txt").read().split("\n")
else:
    required = []
    raise Exception("Unsupported platform " + platform.system())

required.pop(0)
required.pop(0)

satisfies = True
missing = []
conflicting = []
for i in range(len(required)):
    try:
        pkg_resources.require(required[i])
    except DistributionNotFound:
        satisfies = False
        missing.append(formatPackage(required[i]))
    except VersionConflict:
        satisfies = False
        conflicting.append(formatPackage(required[i]))

print(json.dumps({
    "satisfies": satisfies,
    "missing": missing,
    "conflicting": conflicting
}), flush=True)
