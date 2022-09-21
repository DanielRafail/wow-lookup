from flask import Flask, request
import os
from dotenv import load_dotenv
import requests
from base64 import b64encode
import json
from flask_cors import CORS
import urllib.parse

load_dotenv()

app = Flask(__name__)
CORS(app)

allServers = {}
allClasses = {}
colors = {}
allDungeons = {}
json_error_message = "Invalid response cannot be transformed into JSON"

# Wowlogs API route
@app.route("/wowlogs", methods=["GET"])
def wowlogs(recursiveCall = False):
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    # in characterInfo, replacing name by urllib.parse.quote(name.encode('utf-8'), safe='') did not work
    characterInfo = "character(name:\\\""+ name +"\\\", serverSlug:\\\"" + server + "\\\", serverRegion:\\\"" + region + "\\\")"
    url = "https://www.warcraftlogs.com/api/v2/client"
    payload = '{"query":"{characterData{lfr: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 1, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 1, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 1, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 1, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 1, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 1, role:Tank)}normal: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 3, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 3, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 3, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 3, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 3, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 3, role:Tank)}heroic: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 4, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 4, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 4, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 4, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 4, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 4, role:Tank)}mythic: ' + characterInfo + ' {overallDPS: zoneRankings(byBracket:false, difficulty: 5, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 5, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 5, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 5, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 5, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 5, role:Tank)}' + characterInfo + ' {classID}}}"}'  
    headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + os.environ["wowlogs_api_token"]
    }
    json_response = None
    response = requests.post(url, data=payload, headers=headers)
    if is_json(response.text):
        json_response = response.json()
    else:
        print("Invalid response cannot be transformed into JSON")
        return None
    if "error" in json_response and json_response["error"] == "Unauthenticated." and recursiveCall == False:
        os.environ["wowlogs_api_token"] = ""
        getWoWlogsToken()
        while(os.environ["wowlogs_api_token"] == ""):
            pass
        return wowlogs(True)
    if recursiveCall == True:
        return {}
    return json_response

#pvp API route
@app.route("/pvp", methods=["GET"])
def pvp(recursiveCall = False):
    global json_error_message
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    twoRating_url = "https://" + region + ".api.blizzard.com/profile/wow/character/" + server + "/" + name + "/pvp-bracket/2v2?namespace=profile-" + region + "&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
    threeRating_url = "https://" + region + ".api.blizzard.com/profile/wow/character/" + server + "/" + name + "/pvp-bracket/3v3?namespace=profile-" + region +"&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
    allAchievs_url = "https://" + region + ".api.blizzard.com/profile/wow/character/" + server + "/" + name + "/achievements?namespace=profile-" + region + "&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.environ["blizzard_api_token"],
    }
    json_response_two = None
    json_response_three = None
    json_response_achievs = None
    two_response = requests.get(twoRating_url, headers=header)
    three_response = requests.get(threeRating_url, headers=header)
    achievs_response = requests.get(allAchievs_url, headers=header)
    if two_response.status_code == 401 and recursiveCall == False:
        os.environ["blizzard_api_token"] = ""
        getBlizzardToken()
        while(os.environ["blizzard_api_token"] == ""):
            pass
        return pvp(True)
    elif recursiveCall == True:
        return {}
    if is_json(two_response.text):
        json_response_two = two_response.json()
    else:
        print(json_error_message)
        return None
    if is_json(three_response.text):
        json_response_three = three_response.json()
    else:
        print(json_error_message)
        return None
    if is_json(achievs_response.text):
        json_response_achievs = achievs_response.json()
    else:
        print(json_error_message)
        return None
    return {"achievements":json_response_achievs, "two":json_response_two, "three": json_response_three}

#raiderIO API route
@app.route("/raiderio", methods=["GET"])
def raiderio():
    global json_error_message
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    url_dungeons = "https://raider.io/api/v1/characters/profile?region=" + region + "&realm=" + server + "&name=" + name + "&fields=mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all"
    json_response_dungeons = None
    dungeons_response = requests.get(url_dungeons)
    if is_json(dungeons_response.text):
        json_response_dungeons = dungeons_response.json()
    else:
        print(json_error_message)
        return None
    return json_response_dungeons

def getRaiderIOColors():
    global json_error_message
    global colors
    url_colors = "https://raider.io/api/v1/mythic-plus/score-tiers"
    json_response_scoreColors = None
    colors_response = requests.get(url_colors)
    if is_json(colors_response.text):
        json_response_scoreColors = colors_response.json()
    else:
        print(json_error_message)
        return None
    colors = json_response_scoreColors
    return None

@app.route("/colors", methods=["GET"])
def raiderIOColors():
    global colors
    if colors != {}:
        return colors
    else:
        getRaiderIOColors()
        return colors

def getRaiderIOAllDungeons(seasons):
    global json_error_message
    global allDungeons
    seasonID = len(seasons) - 1
    url_allDungeons = "https://raider.io/api/v1/mythic-plus/static-data?expansion_id=" + str(seasonID)
    json_response_allDungeons = None
    allDungeons_response = requests.get(url_allDungeons)
    if is_json(allDungeons_response.text):
        json_response_allDungeons = allDungeons_response.json()
    else:
        print(json_error_message)
        return None    
    allDungeons = json_response_allDungeons
    return None

@app.route("/allDungeons", methods=["GET"])
def raiderIODungeons():
    global allExpansions
    global allDungeons
    if allDungeons != {}:
        return allDungeons
    else:
        getRaiderIOAllDungeons(allExpansions)
        return allDungeons

def getAllExpansions(recursiveCall = False):
    global json_error_message
    global allExpansions
    url = "https://us.api.blizzard.com/data/wow/journal-expansion/index?namespace=static-us&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.environ["blizzard_api_token"],
    }
    json_response = None
    response = requests.get(url, headers=header)
    if response.status_code == 401 and recursiveCall == False:
        os.environ["blizzard_api_token"] = ""
        getBlizzardToken()
        while(os.environ["blizzard_api_token"] == ""):
            pass
        return getAllExpansions(True)
    elif recursiveCall == True:
        return {}
    if is_json(response.text):
        json_response = response.json()
    else:
        print(json_error_message)
        return None
    allExpansions = json_response["tiers"]
    getRaiderIOAllDungeons(allExpansions)
    return 1

@app.route("/servers", methods=["GET"])
def servers():
    if allServers != {}:
        return allServers
    else:
        getAllServers()
        return allServers

@app.route("/classes", methods=["GET"])
def classes():
    if allClasses != {}:
        return allClasses
    else:
        getAllClasses()
        return allClasses

def getWoWlogsToken():
    url = "https://www.warcraftlogs.com/oauth/token"
    payload = "-----i\r\nContent-Disposition: form-data; name=\"grant_type\"\r\n\r\nclient_credentials\r\n-----i--\r\n"    
    userAndPass = b64encode(str.encode(os.getenv("wowlogs_api_id") + ":" + os.getenv("wowlogs_api_secret"))).decode("ascii")
    headers = {
    "Content-Type": "multipart/form-data; boundary=---i",
    "Authorization": "Basic %s" % userAndPass
    }
    response = requests.post(url, data=payload, headers=headers)
    json_response = response.json()
    os.environ["wowlogs_api_token"] = json_response["access_token"] 
    return None

def is_json(myjson):
  try:
    json.loads(myjson)
  except Exception as e:
    return False
  return True


def getBlizzardToken():
    url = "https://us.battle.net/oauth/token"
    payload = "-----i\r\nContent-Disposition: form-data; name=\"grant_type\"\r\n\r\nclient_credentials\r\n-----i--\r\n"    
    userAndPass = b64encode(str.encode(os.getenv("blizzard_api_id") + ":" + os.getenv("blizzard_api_secret"))).decode("ascii")
    headers = {
    "Content-Type": "multipart/form-data; boundary=---i",
    "Authorization": "Basic %s" % userAndPass
    }
    response = requests.post(url, data=payload, headers=headers)
    json_response = response.json()
    os.environ["blizzard_api_token"] = json_response["access_token"] 
    return None

def getAllServers(recursiveCall = False):
    global allServers
    global json_error_message
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.environ["blizzard_api_token"],
    }
    regionsArray = os.environ["regions"].split(",")
    for region in regionsArray:
        url = "https://" + region + ".api.blizzard.com/data/wow/realm/index?namespace=dynamic-" + region + "&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
        json_response = None
        response = requests.get(url, headers=header)
        if response.status_code == 401 and recursiveCall == False:
            os.environ["blizzard_api_token"] = ""
            getBlizzardToken()
            while(os.environ["blizzard_api_token"] == ""):
                pass
            return getAllServers(True)
        elif recursiveCall == True:
            return {}
        if is_json(response.text):
            json_response = response.json()
        else:
            print(json_error_message)
            return None
        allServers[region] = json_response
    return None

def getAllClasses(recursiveCall = False):
    global allClasses
    global json_error_message
    allClassesContent = {}
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.environ["blizzard_api_token"],
    }
    allClassesURL = "https://us.api.blizzard.com/data/wow/playable-class/index?namespace=static-us&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
    allClasses_json_response = None
    allClasses_response = requests.get(allClassesURL, headers=header)
    if allClasses_response.status_code == 401 and recursiveCall == False:
        os.environ["blizzard_api_token"] = ""
        getBlizzardToken()
        while(os.environ["blizzard_api_token"] == ""):
            pass
        return getAllClasses(True)
    elif recursiveCall == True:
        return {}
    if is_json(allClasses_response.text):
        allClasses_json_response = allClasses_response.json()
    else:
        print(json_error_message)
        return None    
    for class_entry in allClasses_json_response["classes"]:
        class_entry_url = "https://us.api.blizzard.com/data/wow/playable-class/" + str(class_entry["id"]) + "?namespace=static-us&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
        class_entry_json_response = None
        class_entry_response = requests.get(class_entry_url, headers=header)
        allClassesContent[class_entry["id"]] = {"name": class_entry["name"], "specs": []}
        if is_json(class_entry_response.text):
            class_entry_json_response = class_entry_response.json()
        else:
            print(json_error_message)
            return None
        for class_entry_detail in class_entry_json_response["specializations"]: 
            allClassesContent[class_entry["id"]]["specs"].append({"name": class_entry_detail["name"], "id": class_entry_detail["id"]})
    allClasses = allClassesContent
    return None


if __name__ == "__main__":
    getWoWlogsToken()
    getBlizzardToken()
    getAllServers()
    getAllClasses()
    getRaiderIOColors()
    getAllExpansions()
    app.run(debug=True) 