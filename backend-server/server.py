from flask import Flask
import os
from dotenv import load_dotenv
import requests
from base64 import b64encode
import json

load_dotenv()

app = Flask(__name__)

# Wowlogs API route
@app.route("/wowlogs")
def wowlogs(recursiveCall = False):  
    characterInfo = 'character(name:\\\"Leeroys\\\", serverSlug:\\\"illidan\\\", serverRegion:\\\"us\\\")'
    url = "https://www.warcraftlogs.com/api/v2/client"
    payload = '{"query":"{characterData{lfr: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 1, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 1, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 1, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 1, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 1, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 1, role:Tank)}normal: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 3, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 3, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 3, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 3, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 3, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 3, role:Tank)}heroic: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 4, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 4, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 4, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 4, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 4, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 4, role:Tank)}mythic: ' + characterInfo + ' {overallDPS: zoneRankings(byBracket:false, difficulty: 5, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 5, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 5, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 5, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 5, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 5, role:Tank)}' + characterInfo + ' {gameData}}}"}'  
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
    elif recursiveCall == True:
        return {}
    return json_response

@app.route("/pvp")
def pvp(recursiveCall = False):
    # ALL WRONG, ITS WOWLOGS SHIT, CHANGE IT
    characterInfo = 'character(name:\\\"Leeroys\\\", serverSlug:\\\"illidan\\\", serverRegion:\\\"us\\\")'
    url = "https://www.warcraftlogs.com/api/v2/client"
    payload = '{"query":"{characterData{lfr: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 1, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 1, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 1, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 1, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 1, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 1, role:Tank)}normal: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 3, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 3, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 3, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 3, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 3, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 3, role:Tank)}heroic: ' + characterInfo + '{overallDPS: zoneRankings(byBracket:false, difficulty: 4, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 4, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 4, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 4, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 4, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 4, role:Tank)}mythic: ' + characterInfo + ' {overallDPS: zoneRankings(byBracket:false, difficulty: 5, metric:dps)ilvlDPS: zoneRankings(byBracket:true, difficulty: 5, metric:dps)overallHPS: zoneRankings(byBracket:false, difficulty: 5, metric:hps)ilvlHPS: zoneRankings(byBracket:true, difficulty: 5, metric:hps)overallTank: zoneRankings(byBracket:false, difficulty: 5, role:Tank)ilvlTank: zoneRankings(byBracket:true, difficulty: 5, role:Tank)}' + characterInfo + ' {gameData}}}"}'  
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
    elif recursiveCall == True:
        return {}
    return json_response



@app.route("/raiderio")
def raiderio():
    name = "leeroys"
    server = "illidan"
    region = "us"
    seasonID = "6"
    url_dungeons = "https://raider.io/api/v1/characters/profile"
    url_allDungeons = "https://raider.io/api/v1/mythic-plus/static-data?expansion_id=" + str(seasonID)
    url_colors = "https://raider.io/api/v1/mythic-plus/score-tiers"
    params = {'region:' + region +',realm:' + server + ',name:' + name + ',fields:' + "mythic_plus_scores_by_season:current,mythic_plus_recent_runs,mythic_plus_best_runs:all,mythic_plus_alternate_runs:all"}
    json_response_dungeons = None
    json_response_allDungeons = None
    json_response_scoreColors = None
    dungeons_response = requests.get(url_dungeons, data=params)
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
    print(dungeons_response.text)
    return "yo"
    #{'raiderIOScores:' + json_response_dungeons + ', allDungeons:' + json_response_allDungeons + ", scoreColors:" + json_response_scoreColors}

def verifyWoWlogsToken():
    print("not implemented")

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


def verifyBlizzardToken():
    print("not implemented")

if __name__ == "__main__":
    app.run(debug=True) 
    getWoWlogsToken()