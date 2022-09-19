from flask import Flask, request
import os
from dotenv import load_dotenv
import requests
from base64 import b64encode
import json
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

allServers = {}

# Wowlogs API route
@app.route("/wowlogs", methods=["GET"])
def wowlogs(recursiveCall = False):
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    characterInfo = "character(name:\\\""+ name +"\\\", serverSlug:\\\"" + server + "\\\", serverRegion:\\\"" + region + "\\\")"
    url = "https://www.warcraftlogs.com/api/v2/client"
    payload = '{"query":"{characterData{lfr: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 1, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 1, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 1, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 1, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 1, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 1, role:Tank)}normal: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 3, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 3, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 3, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 3, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 3, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 3, role:Tank)}heroic: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 4, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 4, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 4, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 4, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 4, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 4, role:Tank)}mythic: ' + characterInfo + ' {overallDPS: zoneRankings(byBracket:false, difficulty: 5, role:DPS)ilvlDPS: zoneRankings(byBracket:true, difficulty: 5, role:DPS)overallHPS: zoneRankings(byBracket:false, difficulty: 5, role:Healer, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 5, role:Healer, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 5, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 5, role:Tank)}' + characterInfo + ' {gameData}}}"}'  
    headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + os.environ["wowlogs_api_token"]
    }
    json_response = None
    response = requests.post(url, data=payload, headers=headers)
    if is_json(response.text):
        json_response = response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
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
    if is_json(two_response.text):
        json_response_two = two_response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
    if is_json(three_response.text):
        json_response_three = three_response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
    if is_json(achievs_response.text):
        json_response_achievs = achievs_response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
    if "error" in two_response and two_response["error"] == "Unauthenticated." and recursiveCall == False:
        os.environ["blizzard_api_token"] = ""
        getBlizzardToken()
        while(os.environ["blizzard_api_token"] == ""):
            pass
        return pvp(True)
    elif recursiveCall == True:
        return {}
    return {"achievements":json_response_achievs, "two":json_response_two, "three": json_response_three}

#raiderIO API route
@app.route("/raiderio", methods=["GET"])
def raiderio():
    name = request.args.get('name')
    region = request.args.get('region')
    server = request.args.get('server')
    seasonID = request.args.get('seasonID')
    url_dungeons = "https://raider.io/api/v1/characters/profile?region=" + region + "&realm=" + server + "&name=" + name + "&fields=mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all"
    url_allDungeons = "https://raider.io/api/v1/mythic-plus/static-data?expansion_id=" + str(seasonID)
    url_colors = "https://raider.io/api/v1/mythic-plus/score-tiers"
    json_response_dungeons = None
    json_response_allDungeons = None
    json_response_scoreColors = None
    dungeons_response = requests.get(url_dungeons)
    allDungeons_response = requests.get(url_allDungeons)
    colors_response = requests.get(url_colors)
    if is_json(dungeons_response.text):
        json_response_dungeons = dungeons_response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
    if is_json(allDungeons_response.text):
        json_response_allDungeons = allDungeons_response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
    if is_json(colors_response.text):
        json_response_scoreColors = colors_response.json()
    else:
        raise Exception("Invalid response cannot be transformed into JSON")
    return {"raiderIOScores": json_response_dungeons, "allDungeons": json_response_allDungeons, "scoreColors": json_response_scoreColors}

@app.route("/servers", methods=["GET"])
def servers():
    return allServers

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
    header = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.environ["blizzard_api_token"],
    }
    regionsArray = os.environ["regions"].split(",")
    for region in regionsArray:
        # not sure if "https://us.api..." or "https://" + region + ".api..."
        url = "https://" + region + ".api.blizzard.com/data/wow/realm/index?namespace=dynamic-" + region + "&locale=en_US&access_token=" + os.environ["blizzard_api_token"]
        json_response = None
        response = requests.get(url, headers=header)
        if is_json(response.text):
            json_response = response.json()
        else:
            raise Exception("Invalid response cannot be transformed into JSON")
        if "error" in response and response["error"] == "Unauthenticated." and recursiveCall == False:
            os.environ["blizzard_api_token"] = ""
            getBlizzardToken()
            while(os.environ["blizzard_api_token"] == ""):
                pass
            return pvp(True)
        elif recursiveCall == True:
            return {}
        allServers[region] = json_response
    return None


if __name__ == "__main__":
    getWoWlogsToken()
    getBlizzardToken()
    getAllServers()
    app.run(debug=True) 