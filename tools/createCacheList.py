# I really don't know if this is efficient or not, but i honestly don't care enough to figure out how to do this in js

import os
import json

outputFile = "./cachedData.json"


def checkFiles(fileToCheck):
    filesGotten = []

    fileItems = os.listdir(fileToCheck)

    for index in fileItems:
        if index[0] == ".":
            continue

        if os.path.isdir(fileToCheck+index):
            filesGotten = filesGotten + checkFiles(fileToCheck+index+"/")
        elif os.path.isfile(fileToCheck+index):
            filesGotten.append(fileToCheck+index)
    return filesGotten


files = checkFiles("./")


with open(outputFile, "w") as output:
    json.dump(obj=files, fp=output, indent=4)
