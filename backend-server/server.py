from flask import Flask, request
import os
from dotenv import load_dotenv
import requests
from base64 import b64encode
import json
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import abort
from parser.pvp import parsePVPData 
from parser.raiderIO import parseRaiderIOData 
from parser.wowlogs import parseWowlogsData 

app = Flask(__name__)

load_dotenv()
limiter = Limiter(app, key_func=get_remote_address)
CORS(app)

allServers = {}
allClasses = {}
colors = {}
allDungeons = {}
allExpansions = {}
pvpSeasonID = None

# Wowlogs API route
@app.route("/wowlogs", methods=["GET"])
@limiter.limit("60/minute")
def wowlogs(recursiveCall = False):
    global allClasses
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    characterInfo = "character(name:\"{name}\", serverSlug:\"{server}\", serverRegion:\"{region}\")".format(name=name, server=server, region=region)
    url = "https://www.warcraftlogs.com/api/v2/client"
    payload = {"query":"{characterData{lfr: " + characterInfo + "{overallDPS: zoneRankings(byBracket:false, difficulty: 1, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 1, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 1, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 1, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 1, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 1, role:Tank)}normal: " + characterInfo + "{overallDPS: zoneRankings(byBracket:false, difficulty: 3, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 3, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 3, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 3, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 3, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 3, role:Tank)}heroic: " + characterInfo + "{overallDPS: zoneRankings(byBracket:false, difficulty: 4, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 4, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 4, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 4, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 4, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 4, role:Tank)}mythic: " + characterInfo + "{overallDPS: zoneRankings(byBracket:false, difficulty: 5, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 5, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 5, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 5, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 5, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 5, role:Tank)}" + characterInfo + "{classID}}}"}
    headers = {
    "Authorization": "Bearer {token}".format(token=os.environ["wowlogs_api_token"])
    }
    response = requests.post(url, json=payload, headers=headers)
    verifyBlizzardToken(response, recursiveCall, wowlogs)
    return parseWowlogsData(response.json(), allClasses) if response.status_code >= 200 and response.status_code < 300 else {"status":response.status_code} 

# pvp API route
@app.route("/pvp", methods=["GET"])
@limiter.limit("60/minute")
def pvp(recursiveCall = False):
    global allClasses
    global allExpansions
    global pvpSeasonID
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    profile_url = "https://{region}.api.blizzard.com/profile/wow/character/{server}/{name}?namespace=profile-{region}&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"], server=server, name=name, region=region)
    twoRating_url = "https://{region}.api.blizzard.com/profile/wow/character/{server}/{name}/pvp-bracket/2v2?namespace=profile-{region}&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"], server=server, region=region, name=name)
    threeRating_url = "https://{region}.api.blizzard.com/profile/wow/character/{server}/{name}/pvp-bracket/3v3?namespace=profile-{region}&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"], server=server, region=region, name=name)
    allAchievs_url = "https://{region}.api.blizzard.com/profile/wow/character/{server}/{name}/achievements?namespace=profile-{region}&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"], server=server, region=region, name=name)
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer {token}".format(token=os.environ["blizzard_api_token"]),
    }
    json_profile_response = None
    json_response_two = None
    json_response_three = None
    json_response_achievs = None
    json_soloShuffle = None
    profile_response = requests.get(profile_url, headers=header)
    two_response = requests.get(twoRating_url, headers=header)
    three_response = requests.get(threeRating_url, headers=header)
    achievs_response = requests.get(allAchievs_url, headers=header)
    json_soloShuffle = dict()
    verifyBlizzardToken(two_response, recursiveCall, pvp)
    if is_json(profile_response.text):
        json_profile_response = profile_response.json()
        for spec in allClasses[json_profile_response["character_class"]["id"]]["specs"]:
            url = "https://{region}.api.blizzard.com/profile/wow/character/{server}/{name}/pvp-bracket/shuffle-{charClass}-{spec}?namespace=profile-{region}&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"], server=server, name=name, region=region, charClass=allClasses[json_profile_response["character_class"]["id"]]["name"].lower(), spec=spec['name'].lower())
            shuffle_response = requests.get(url, headers=header)
            if shuffle_response.status_code >= 200 and shuffle_response.status_code <= 300 and is_json(shuffle_response.text):
                json_soloShuffle[spec['name']] = shuffle_response.json()
            else:
                print("Spec: {spec} unable to be added to shuffle_response".format(spec=spec['name']))
    else:
         print(profile_response)
    if is_json(two_response.text):
        json_response_two = two_response.json()
    else:
        print(two_response.status_code, two_response)
    if is_json(three_response.text):
        json_response_three = three_response.json()
    else:
        print(three_response.status_code, three_response)
    if (achievs_response.status_code >= 300 and achievs_response.status_code < 200):
        abort(achievs_response)
    if is_json(achievs_response.text):
        json_response_achievs = achievs_response.json()
    else:
        print(achievs_response.status_code, achievs_response)
    return parsePVPData({"achievements":json_response_achievs, "two":json_response_two, "three": json_response_three, "solo":json_soloShuffle}, allExpansions)

# raiderIO API route
@app.route("/raiderio", methods=["GET"])
@limiter.limit("60/minute")
def raiderio():
    global allDungeons
    global colors
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    url_dungeons = "https://raider.io/api/v1/characters/profile?region={region}&realm={server}&name={name}&fields=mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all".format(server=server, region=region, name=name)
    dungeons_response = requests.get(url_dungeons)
    raiderIO = verifyAPIAnswer(dungeons_response)
    return {"raiderIO": parseRaiderIOData(raiderIO), "colors" : colors, "dungeons": allDungeons}

# getCurrentPVPSeason
def getPVPSeason(recursiveCall = False):
    global pvpSeasonID
    if pvpSeasonID is None:
        currentSeason_url = "https://us.api.blizzard.com/data/wow/pvp-season/index?namespace=dynamic-us&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"])
        header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}".format(token=os.environ["blizzard_api_token"]),
        }
        currentSeason_response = requests.get(currentSeason_url, headers=header)
        verifyBlizzardToken(currentSeason_response, recursiveCall, getPVPSeason)
        json_currentSeason = verifyAPIAnswer(currentSeason_response)
        pvpSeasonID = json_currentSeason['current_season']['id']
        return None


        

# Get RaiderIO colors
def getRaiderIOColors():
    global colors
    url_colors = "https://raider.io/api/v1/mythic-plus/score-tiers"
    colors_response = requests.get(url_colors)
    colors = verifyAPIAnswer(colors_response) 
    return None

# Route to get Wowlogs colors
@app.route("/colors", methods=["GET"])
def raiderIOColors():
    global colors
    if colors != {}:
        return colors
    else:
        getRaiderIOColors()
        return colors

# Get RaiderIO score for all M+ dungeons
def getRaiderIOAllDungeons(allExpansions):
    global allDungeons
    url_allDungeons = "https://raider.io/api/v1/mythic-plus/static-data?expansion_id={seasonID}".format(seasonID=str(len(allExpansions) - 1))
    allDungeons_response = requests.get(url_allDungeons)
    allDungeons = verifyAPIAnswer(allDungeons_response)  
    return None

# Route to get all current M+ dungeons
@app.route("/allDungeons", methods=["GET"])
def raiderIODungeons():
    global allExpansions
    global allDungeons
    if allDungeons != {}:
        return allDungeons
    else:
        getRaiderIOAllDungeons(allExpansions)
        return allDungeons

# Get all Expansions 
def getAllExpansions(recursiveCall = False):
    global allExpansions
    url = "https://us.api.blizzard.com/data/wow/journal-expansion/index?namespace=static-us&locale=en_US&access_token={token}".format(token=os.environ["blizzard_api_token"])
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer {token}".format(token=os.environ["blizzard_api_token"]),
    }
    response = requests.get(url, headers=header)
    verifyBlizzardToken(response, recursiveCall, getAllExpansions)
    json_response = verifyAPIAnswer(response)
    allExpansions = sorted(json_response["tiers"], key=lambda d: d['id'])
    # - 1 because of 
    allExpansions.pop(len(allExpansions) - 1)
    getRaiderIOAllDungeons(allExpansions)
    return 1


# Route for getting servers 
@app.route("/servers", methods=["GET"])
def servers():
    if allServers != {}:
        return allServers
    else:
        getAllServers()
        return allServers

# Route for getting classes
@app.route("/classes", methods=["GET"])
def classes():
    if allClasses != {}:
        return allClasses
    else:
        getAllClasses()
        return allClasses

# Get Wowlogs API token
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

# Verify if object is of type JSON
def is_json(myjson):
  try:
    json.loads(myjson)
  except Exception as e:
    return False
  return True

# Get the Blizzard API token
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

# Get all Servers/Realms in the game
def getAllServers(recursiveCall = False):
    global allServers
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer {token}".format(token=os.environ["blizzard_api_token"]),
    }
    regionsArray = os.environ["regions"].split(",")
    for region in regionsArray:
        url = "https://{region}.api.blizzard.com/data/wow/realm/index?namespace=dynamic-{region}&locale=en_US&access_token={token}".format(token = os.environ["blizzard_api_token"], region=region)
        json_response = None
        response = requests.get(url, headers=header)
        verifyBlizzardToken(response, recursiveCall, getAllServers)
        json_response = verifyAPIAnswer(response)
        allServers[region] = json_response
    return None

# Get all classes in the game and their specs
def getAllClasses(recursiveCall = False):
    global allClasses
    allClassesContent = {}
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer {token}".format(token=os.environ["blizzard_api_token"]),
    }
    allClassesURL = "https://us.api.blizzard.com/data/wow/playable-class/index?namespace=static-us&locale=en_US&access_token={token}".format(token=os.environ["blizzard_api_token"])
    allClasses_response = requests.get(allClassesURL, headers=header)
    verifyBlizzardToken(allClasses_response, recursiveCall, getAllClasses)
    allClasses_json_response = verifyAPIAnswer(allClasses_response)
    
    for class_entry in allClasses_json_response["classes"]:
        class_entry_url = "https://us.api.blizzard.com/data/wow/playable-class/{classID}?namespace=static-us&locale=en_US&access_token={token}".format(token=os.environ["blizzard_api_token"], classID=str(class_entry["id"]))
        class_entry_json_response = None
        class_entry_response = requests.get(class_entry_url, headers=header)
        allClassesContent[class_entry["id"]] = {"name": class_entry["name"], "specs": []}
        class_entry_json_response = verifyAPIAnswer(class_entry_response)
        for class_entry_detail in class_entry_json_response["specializations"]: 
            allClassesContent[class_entry["id"]]["specs"].append({"name": class_entry_detail["name"], "id": class_entry_detail["id"]})
    allClasses = allClassesContent
    return None

# Verify the answer is a valid JSON
def verifyAPIAnswer(jsonResponse):
    if jsonResponse.status_code < 300 and jsonResponse.status_code >= 200 and is_json(jsonResponse.text):
        return jsonResponse.json()
    else:
        abort(jsonResponse, jsonResponse.status_code)

# If Blizzard token is unauthorized, get new one and call original function. If its a recursive call, abort
def verifyBlizzardToken(jsonResponse, recursiveCall, originalFunction):
    if jsonResponse.status_code == 401 and recursiveCall == False:
        os.environ["blizzard_api_token"] = ""
        getBlizzardToken()
        return originalFunction(True)
    elif recursiveCall == True:
        abort(jsonResponse.status_code)


if __name__ == "__main__":
    getWoWlogsToken()
    getBlizzardToken()
    getAllServers()
    getAllClasses()
    getRaiderIOColors()
    getAllExpansions()
    getPVPSeason()
    app.run(debug=True) 