import helper
import json
import math


def parseWowlogsData(wowlogsData, classesData):
    characterData = wowlogsData["data"]["characterData"]
    roles = ["DPS", "HPS", "Tank"]
    if characterData["character"] is None:
        print(
            "Character unable to be found. Most likely never completed any content so far")
        return {"status": 404}
    roles = ["DPS", "Healer", "Tank"]
    tiers = ["lfr", "normal", "heroic", "mythic"]

    results = {role: {} for role in roles}
    rolesToRemove = set()
    for role_idx, role in enumerate(roles):
        for tier in tiers:
            if "overall{role}".format(role=role) in characterData[tier].keys():
                result = parseWowlogsDataTiers(
                    characterData[tier],
                    roles[role_idx],
                    classesData,
                    characterData["character"]["classID"]
                )
                results[role][tier] = result
            else:
                rolesToRemove.add(role)
    for toRemove in rolesToRemove:
        del results[toRemove]
    roles = [x for x in roles if x not in rolesToRemove]
    allSpecs = dict()
    for i, key in enumerate(results.keys()):
        spec = verifyRoleAverageParse(
            characterData["lfr"],
            characterData["normal"],
            characterData["heroic"],
            characterData["mythic"],
            roles[i]
        )
        allSpecs[key] = spec
    mainParsePerDifficulty = findMainParsePerDifficulty(allSpecs)
    return json.dumps({
        "tableData": results,
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


def findMainParsePerDifficulty(specs):
    mainParsePerDifficulty = {
        "lfr": {},
        "normal": {},
        "heroic": {},
        "mythic": {},
    }
    for difficulty in mainParsePerDifficulty:
        highestParseAveragePerDifficulty = 0
        specIndex = -1
        for i,spec in enumerate(specs.values()):
            if highestParseAveragePerDifficulty < spec[difficulty]:
                highestParseAveragePerDifficulty = spec[difficulty]
                specIndex = i
        mainParsePerDifficulty[difficulty] = list(specs.keys())[specIndex]
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
            mythicScore = mythicScore + \
                mythic["overall"+metric]["rankings"][i]["allStars"]["points"] if mythic["overall" +
                                                                                        metric]['rankings'][i]['allStars'] else mythicScore
        if heroic and heroic["overall"+metric]["rankings"][i]["totalKills"] > 0:
            heroicScore = heroicScore + \
                heroic["overall" + metric]["rankings"][i]["allStars"]["points"] if heroic["overall" +
                                                                                          metric]['rankings'][i]['allStars'] else heroicScore
        if normal and normal["overall"+metric]["rankings"][i]["totalKills"] > 0:
            normalScore = normalScore + \
                normal["overall"+metric]["rankings"][i]["allStars"]["points"] if normal["overall" +
                                                                                        metric]['rankings'][i]['allStars'] else normalScore
        else:
            LFRScore = LFRScore + \
                LFR["overall"+metric]["rankings"][i]["allStars"]["points"] if LFR["overall" +
                                                                                  metric]['rankings'][i]['allStars'] else LFRScore
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
    overallMetric = tier["overall"+metric] if "overall" + \
        metric in tier.keys() else {"rankings": {}}
    ilvlMetric = tier["ilvl"+metric]
    specID = None
    for i, entry in enumerate(overallMetric["rankings"]):
        if classesData:
            for spec in classesData[helper.blizzardClassIDToWowlogsClassID(classID)]["specs"]:
                if entry and entry["spec"] and entry["spec"] == spec["name"]:
                    specID = spec['id']
        returnDictionary["data"].append({
            "boss": entry["encounter"]["name"],
            "overall": str(math.floor(entry["rankPercent"])) + "%" if entry["rankPercent"] else "-",
            "ilvl": str(math.floor(ilvlMetric["rankings"][i]["rankPercent"])) + "%" if ilvlMetric["rankings"][i]["rankPercent"]
            else "-",
            metric: str('{0:,}'.format(math.floor(entry["bestAmount"]))) if ilvlMetric["rankings"][i]["rankPercent"] else "-",
            "killCount": entry["totalKills"],
        })
        returnDictionary["spec"].append({"spec": entry["spec"], "specID": specID}
                                        ) if classesData else returnDictionary["spec"].append({"spec": entry["spec"]})
    return returnDictionary
