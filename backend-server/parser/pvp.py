
import re
from functools import cmp_to_key

allExpansions = None

'''
   * Parses the data of PVP into usable dictionaries
   * @param {Object} pvpData The data dictionary we get from the blizzard PVP APIs
   * @returns A usable dictionary
'''


def parsePVPData(pvpData, allXpacs):
    global allExpansions
    allExpansions = allXpacs
    pvpAchievs = getAllPVPAchievs(pvpData["achievements"]["achievements"])
    pvpExpansions = sorted(
        pvpAchievs["seasonsPlayed"], key=cmp_to_key(sortPVPSeasons))
    seasonsPerExpansions = findHighestPVPAchievBySeason(
        pvpAchievs["achievs"],
        pvpExpansions,
    )
    twoRating = getRating(pvpData["two"])
    threeRating = getRating(pvpData["three"])
    returnDict = {
        "rankHistory": seasonsPerExpansions,
        "brackets": {
            "twoRating": twoRating,
            "threeRating": threeRating,
        }}
    for spec in pvpData["solo"]:
        returnDict["brackets"][spec] = getRating(pvpData["solo"][spec])
    return returnDict


'''
 * Get the rating and stats of a player has within a certain PVP bracket
 * @param {Object} bracket The pvp bracket
 * @returns the player's rating and weekly and season stats
'''


def getRating(bracket):
    if "season_round_statistics" in bracket:
        return {
            "rating": bracket["rating"],
            "seasonStats": bracket["season_round_statistics"],
            "weeklyStats": bracket["weekly_round_statistics"],
        }
    elif "season_match_statistics" in bracket:
        return {
            "rating": bracket["rating"],
            "seasonStats": bracket["season_match_statistics"],
            "weeklyStats": bracket["weekly_match_statistics"],
        }


'''
 * Within the array of every achievement, find all the PVP achievements
 * @param {Object} allAchievs Array with every achievement earned by the player
 * @returns An array with all the PVP achievements string names
'''


def getAllPVPAchievs(allAchievs):
    achievs = []
    seasonsPlayed = set()
    for achievement in allAchievs:
        if ("criteria" in achievement.keys() or "completed_timestamp" in achievement.keys()) and (re.search("Season [0-9]$", achievement["achievement"]["name"])) and "Hero" not in achievement["achievement"]["name"]:
            # Returns only Warlords instead of Warlords of Draenor from APIs so have to fix that
            # Blizzard, why are your APIs so shit
            achievName = achievement["achievement"]["name"]
            if "Warlords" in achievName:
                achievName = achievName[0:achievName.find(
                    "Season")] + "of Draenor" + achievName[achievName.find("Season") - 1:]
            seasonsPlayed.add(returnExpansionName(achievName))
            achievs.append({"achiev": achievName, "completed": True if "completed_timestamp" in achievement.keys(
            ) else achievement["criteria"]["is_completed"]})
    return {"achievs": achievs, "seasonsPlayed": list(seasonsPlayed)}


'''
 * Return the expansion name inside of the achievement
 * @param {string} The achievement name
 * @returns The expansion within its name
'''


def returnExpansionName(achievName):
    return achievName[achievName.find(":") + 2: achievName.find("Season")].strip()


'''
 * Find the highest rank someone had per season
 * @param {Object} pvpAchievs all the achievements
 * @param {Object} seasons all the seasons
 * @returns A dictionary object with key as season and value as rank
'''


def findHighestPVPAchievBySeason(achievs, pvpExpansions):
    pvpRanking = {
        "Combatant": 0,
        "Challenger": 1,
        "Rival": 2,
        "Duelist": 3,
        "Elite": 4,
        "Legend": 5,
        "Gladiator": 6,
    }
    highest_achievements = dict()
    for expansion in pvpExpansions:
        highest_achievements[expansion] = {}
    # need to implement logic to find the highest for each season
    for i, achiev in enumerate(achievs):
        parts = achiev["achiev"].split(": ")
        if len(parts) == 2:
            title, season_info = parts
            season_parts = season_info.split(" Season ")
        if len(season_parts) == 2:
            expansion, season_str = season_parts
            season_number = int(season_str)
            # If I want to add the 0.1% title like sinful or fearless
            # I have to do an API call to get all the seasons, find a way to find the 0.1% title
            # associated with each seasons and make a dictionary of it
            # logic would be outside this for loop because there is no Season X in the title
            # For now, will just keep gladiator
            # if "gladiator".lower() in title and title not in pvpRanking.keys():
            #     pvpRanking[title] = 7
            if expansion in pvpExpansions and title in pvpRanking.keys():
                if season_number not in highest_achievements[expansion]:
                    highest_achievements[expansion][season_number] = {
                        "title": title, "completed": achiev["completed"]}
                else:
                    current_highest = highest_achievements[expansion][season_number]["title"]
                    if pvpRanking[title] > pvpRanking[current_highest]:
                        highest_achievements[expansion][season_number] = {
                            "title": title, "completed": achiev["completed"]}
    seasonsPerExpansions = dict()
    for i, expansion in enumerate(highest_achievements.keys()):
        seasonPerExpansion = {"id": i, "seasons": []}
        for key, seasons in highest_achievements[expansion].items():
            seasonPerExpansion["seasons"].append({"name": "Season {num}: {title}".format(
                num=key, title=seasons["title"]), "completed": seasons["completed"]})
        seasonsPerExpansions[expansion] = seasonPerExpansion
    return seasonsPerExpansions


'''
 * Get the correct Title, figure out if the title is a Rank: X type, Rank: X II type, or Gladiator type (you can have Shadowlands: Rival, Shadowlands: Rival II or Shadowlands: Sinful Gladiator)
 * @param {string} achievement The achievement that will be analyzed
 * @returns The rank of the achievement without the season
'''


def returnCorrectRankSubstring(achievement):
    rankWithNumber = achievement[0:achievement.find(" ")]
    rankWithoutNumber = achievement[0:achievement.find(":")]
    return rankWithoutNumber if "Gladiator" in achievement else rankWithNumber if len(rankWithoutNumber) > len(rankWithNumber) else rankWithoutNumber


'''
 * Sort PVP seasons by expansion and then by season
 * @param {string} comparator String of the PVP achievement title we will compare to
 * @param {string} compared String of the PVP achievement title that will be compared
 * @returns An int value equivalent to their sorting order
'''


def sortPVPSeasons(comparator, compared):
    global allExpansions
    comparedExpansion = None
    ComparatorExpansion = None
    compared, comparator, = compared.strip().lower(), comparator.strip().lower()
    for expansion in allExpansions:
        name = expansion["name"].strip().lower()
        if name == compared:
            comparedExpansion = expansion
        if name == comparator:
            ComparatorExpansion = expansion
        if comparedExpansion and ComparatorExpansion:
            break

    return (
        comparedExpansion["id"] - ComparatorExpansion["id"] or
        int(compared[len(compared) - 1: len(compared)]) -
        int(comparator[len(comparator) - 1: len(comparator)]))
