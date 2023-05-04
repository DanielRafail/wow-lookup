import helper
import json

def parseWowlogsData(wowlogsData, classesData):
    characterData = wowlogsData["data"]["characterData"]
    roles = ["DPS", "HPS", "Tank"]
    if characterData["character"] is None:
        return None
    lfrDPS = parseWowlogsDataTiers(
        characterData["lfr"],
        roles[0],
        classesData,
        characterData["character"]["classID"]
    )
    normalDPS = parseWowlogsDataTiers(
        characterData["normal"],
        roles[0],
        classesData,
        characterData["character"]["classID"]
    )
    heroicDPS = parseWowlogsDataTiers(
        characterData["heroic"],
        roles[0],
        classesData,
        characterData["character"]["classID"]
    )
    mythicDPS = parseWowlogsDataTiers(
        characterData["mythic"],
        roles[0],
        classesData,
        characterData["character"]["classID"]
    )
    lfrHealer = parseWowlogsDataTiers(
        characterData["lfr"],
        roles[1],
        classesData,
        characterData["character"]["classID"]
    )
    normalHealer = parseWowlogsDataTiers(
        characterData["normal"],
        roles[1],
        classesData,
        characterData["character"]["classID"]
    )
    heroicHealer = parseWowlogsDataTiers(
        characterData["heroic"],
        roles[1],
        classesData,
        characterData["character"]["classID"]
    )
    mythicHealer = parseWowlogsDataTiers(
        characterData["mythic"],
        roles[1],
        classesData,
        characterData["character"]["classID"]
    )
    lfrTank = parseWowlogsDataTiers(
        characterData["lfr"],
        roles[2],
        classesData,
        characterData["character"]["classID"]
    )
    normalTank = parseWowlogsDataTiers(
        characterData["normal"],
        roles[2],
        classesData,
        characterData["character"]["classID"]
    )
    heroicTank = parseWowlogsDataTiers(
        characterData["heroic"],
        roles[2],
        classesData,
        characterData["character"]["classID"]
    )
    mythicTank = parseWowlogsDataTiers(
        characterData["mythic"],
        roles[2],
        classesData,
        characterData["character"]["classID"]
    )
    dps = verifyRoleAverageParse(
        characterData["lfr"],
        characterData["normal"],
        characterData["heroic"],
        characterData["mythic"],
        roles[0]
    )
    hps = verifyRoleAverageParse(
        characterData["lfr"],
        characterData["normal"],
        characterData["heroic"],
        characterData["mythic"],
        roles[1]
    )
    tank = verifyRoleAverageParse(
        characterData["lfr"],
        characterData["normal"],
        characterData["heroic"],
        characterData["mythic"],
        roles[2]
    )
    mainParsePerDifficulty = findMainParsePerDifficulty(dps, hps, tank)
    return json.dumps({
        "tableData": {
            "DPS": {
                "lfr": lfrDPS,
                "normal": normalDPS,
                "heroic": heroicDPS,
                "mythic": mythicDPS,
            },
            "Healer": {
                "lfr": lfrHealer,
                "normal": normalHealer,
                "heroic": heroicHealer,
                "mythic": mythicHealer,
            },
            "Tank": {
                "lfr": lfrTank,
                "normal": normalTank,
                "heroic": heroicTank,
                "mythic": mythicTank,
            },
        },
        "highestDifficulty": 4 if mainParsePerDifficulty["mythic"]
        else 3 if mainParsePerDifficulty["heroic"]
        else 2 if mainParsePerDifficulty["normal"]
        else 1 if mainParsePerDifficulty["normal"]
        else 0,
        "mainParsePerDifficulty": mainParsePerDifficulty,
        "class": classesData[
            helper.blizzardClassIDToWowlogsClassID(characterData["character"]["classID"])]["name"] if characterData["character"]["classID"] and classesData
        else None
    }, sort_keys=False)


'''
* Finds the highest spec you parse with per difficulty
    * @param {Object} dps Dictionary holding the dps parses
    * @param {Object} hps Dictionary holding the hps parses
    * @param {Object} tank Dictionary holding the tank parses
    * @returns Dictionary with the highest spec per tier
'''


def findMainParsePerDifficulty(dps, hps, tank):
    mainParsePerDifficulty = {
        "lfr": {},
        "normal": {},
        "heroic": {},
        "mythic": {},
    }
    allParses = {"DPS": dps, "Healer": hps, "Tank": tank}
    for difficulty in mainParsePerDifficulty:
        highestParseAveragePerDifficulty = 0
        entryIndex = -1
        count = 0
        for roleParse in allParses:
            if highestParseAveragePerDifficulty < allParses[roleParse][difficulty]:
                highestParseAveragePerDifficulty = allParses[roleParse][difficulty]
                entryIndex = count
            count += 1
        mainParsePerDifficulty[difficulty] = list(allParses.keys())[entryIndex]
    return mainParsePerDifficulty


'''
 * Return the average parse for a given role
 * @param {Object} normal Dictionary containing the normal parses
 * @param {Object} heroic Dictionary containing the heroic parses
 * @param {Object} mythic Dictionary containing the mythic parses
 * @returns Dictionary containing average parses per tier for a given role
 '''


def verifyRoleAverageParse(LFR, normal, heroic, mythic, metric):
    mythicScore = 0
    heroicScore = 0
    normalScore = 0
    LFRScore = 0
    bossKills = 0
    for i in range(len(mythic["overall"+metric]["rankings"])):
        if mythic["overall"+metric]["rankings"][i] and mythic["overall"+metric]["rankings"][i]["totalKills"] > 0:
            mythicScore = mythicScore + mythic["overall"+metric]["rankings"][i]["allStars"]["points"] if mythic["overall"+metric]['rankings'][i]['allStars'] else mythicScore
        if heroic and heroic["overall"+metric]["rankings"][i]["totalKills"] > 0:
            heroicScore = heroicScore + heroic["overall" +metric]["rankings"][i]["allStars"]["points"] if heroic["overall"+metric]['rankings'][i]['allStars'] else heroicScore
        if normal and normal["overall"+metric]["rankings"][i]["totalKills"] > 0:
            normalScore = normalScore + normal["overall"+metric]["rankings"][i]["allStars"]["points"] if normal["overall"+metric]['rankings'][i]['allStars'] else normalScore
        else:
            LFRScore = LFRScore + LFR["overall"+metric]["rankings"][i]["allStars"]["points"] if LFR["overall"+metric]['rankings'][i]['allStars'] else LFRScore
        bossKills = bossKills + 1
    return {
        "mythic": mythicScore / bossKills,
        "heroic": heroicScore / bossKills,
        "normal": normalScore / bossKills,
        "lfr": LFRScore / bossKills,
    }


'''
 * Parse the logs for each tier for each role
 * @param {Object} tier Dictionary representing the tier
 * @param {string} metric Role being parsed
 * @param {Object} classesData Dictionary holding classes and specs
 * @param {int} classID The id of the class currently being parsed
 * @returns Dictionary with parsed information
 '''


def parseWowlogsDataTiers(tier, metric, classesData, classID):
    returnDictionary = {"spec": [], "data": []}
    overallMetric = tier["overall"+metric]
    ilvlMetric = tier["ilvl"+metric]
    specID = None
    for i, entry in enumerate(overallMetric["rankings"]):
        if classesData:
            for spec in classesData[helper.blizzardClassIDToWowlogsClassID(classID)]["specs"]:
                if entry and entry["spec"] and entry["spec"] == spec["name"]:
                    specID = spec['id']
        returnDictionary["data"].append({
            "boss": entry["encounter"]["name"],
            "overall": str(round(entry["rankPercent"])) + "%" if entry["rankPercent"] else "-",
            "ilvl": str(round(ilvlMetric["rankings"][i]["rankPercent"])) + "%" if ilvlMetric["rankings"][i]["rankPercent"]
            else "-",
            metric: str(round(entry["bestAmount"])) if ilvlMetric["rankings"][i]["rankPercent"] else "-",
            "killCount": entry["totalKills"],
        })
        returnDictionary["spec"].append({"spec": entry["spec"], "specID": specID}
                                        ) if classesData else returnDictionary["spec"].append({"spec": entry["spec"]})
    return returnDictionary