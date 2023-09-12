
import re
from functools import cmp_to_key

allExpansions = None

'''
   * Parses the data of PVP into usable dictionaries
   * @param {Object} pvpData The data dictionary we get from the blizzard PVP APIs
   * @returns A usable dictionary
'''


def parsePVPData(pvpData, allXpacs, currentSeasonId):
    global allExpansions
    allExpansions = allXpacs
    pvpAchievs = getAllPVPAchievs(pvpData["achievements"]["achievements"])
    pvpSeasons = findEveryPVPSeason(pvpAchievs["pvpAchievs"])
    seasonsPerExpansions = divideSeasonsPerExpansion(pvpSeasons)
    findHighestPVPAchievBySeason(
        pvpAchievs["pvpAchievs"],
        seasonsPerExpansions,
        pvpAchievs["doneOnThisChar"]
    )
    twoRating = getRating(pvpData["two"], currentSeasonId)
    threeRating = getRating(pvpData["three"], currentSeasonId)
    returnDict = {
        "rankHistory": seasonsPerExpansions,
        "brackets": {
            "twoRating": twoRating,
            "threeRating": threeRating,
        }}
    for spec in pvpData["solo"]:
        returnDict["brackets"][spec] = getRating(pvpData["solo"][spec], currentSeasonId)
    return returnDict


'''
 * Create a dictionary object with keys for every expansion, and empty values
 * @param {Dict} seasons
 * @returns
'''


def divideSeasonsPerExpansion(seasons):
    previousExpansionEntry = ""
    dividedSeasons = {}
    count = 0
    for season in seasons:
        currentExpansionEntry = getExpansionFromString(season)
        if currentExpansionEntry != previousExpansionEntry:
            previousExpansionEntry = currentExpansionEntry
            dividedSeasons[currentExpansionEntry] = {
                "id": count, "seasons": []}
            count += 1
        dividedSeasons[currentExpansionEntry]["seasons"].append({season: ""})
    return dividedSeasons


'''
 * Get the rating and stats of a player has within a certain PVP bracket
 * @param {Object} bracket The pvp bracket
 * @returns the player's rating and weekly and season stats
'''


def getRating(bracket, currentSeasonId):
    if(bracket['season']['id'] == currentSeasonId):
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
    pvpAchievs = []
    doneOnThisChar = []
    for achievement in allAchievs:
        if re.search("Season [0-9]$", achievement["achievement"]["name"]) and "Hero" not in achievement["achievement"]["name"] and "Legend" not in achievement["achievement"]["name"]:
            doneOnThisChar.append(
                achievement["criteria"]["is_completed"] if achievement["criteria"] else False)
            # Returns only Warlords instead of Warlords of Draenor from APIs so have to fix that
            # Blizzard, why are your APIs so shit
            if "Warlords" in achievement["achievement"]["name"]:
                uncompleteAchievementName = achievement["achievement"]["name"]
                pvpAchievs.append(
                    uncompleteAchievementName[
                        0:
                        uncompleteAchievementName.find("Season")
                    ] +
                    "of Draenor" +
                    uncompleteAchievementName[
                        uncompleteAchievementName.find("Season") - 1:]
                )
            else:
                pvpAchievs.append(achievement["achievement"]["name"])
    return {"pvpAchievs": pvpAchievs, "doneOnThisChar": doneOnThisChar}


'''
 * Find the highest rank someone had per season
 * @param {Object} pvpAchievs all the achievements
 * @param {Object} seasons all the seasons
 * @returns A dictionary object with key as season and value as rank
'''


def findHighestPVPAchievBySeason(pvpAchievs, seasonsPerExpansions, doneOnThisChar):
    pvpRanking = {
        "Combatant": 0,
        "Challenger": 1,
        "Rival": 2,
        "Duelist": 3,
        "Elite": 4,
        "Gladiator": 5,
    }
    counter = len(pvpRanking)
    for expansion in seasonsPerExpansions:
        for seasons in seasonsPerExpansions[expansion]["seasons"]:
            for season in seasons:
                doneOnThisCharCounter = 0
                highestRank = 0
                for achievement in pvpAchievs:
                    if season in achievement:
                        rankName = returnCorrectRankSubstring(achievement)
                        try:
                            # here to see if exception is thrown (not in pvpRanking)
                            x = pvpRanking[rankName]
                        except:
                            if "Gladiator" in rankName:
                                pvpRanking[rankName] = counter
                                counter += 1
                        if highestRank < pvpRanking[rankName]:
                            highestRank = pvpRanking[rankName]
                    doneOnThisCharCounter += 1
            seasons[season] = list(pvpRanking)[highestRank]
            seasons["doneOnThisChar"] = doneOnThisChar[doneOnThisCharCounter - 1]
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
 * Based on the PVP achievement title, figure out the expansion it belongs to
 * @param {string} str  The PVP achievement title
 * @returns The expansion it belongs to
'''


def getExpansionFromString(str):
    return str[0: str.find("Season") - 1]


'''
 * Find every season the player received a rank
 * @param {Object} pvpAchievs all the achievements the player has
 * @returns An array with all the seasons the player had a rank
'''


def findEveryPVPSeason(pvpAchievs):
    seasons = []
    season = ""
    for achievement in pvpAchievs:
        season = achievement[achievement.find(":") + 2:]
        if season not in seasons:
            seasons.append(season)
    return sorted(seasons, key=cmp_to_key(sortPVPSeasons))


'''
 * Sort PVP seasons by expansion and then by season
 * @param {string} comparator String of the PVP achievement title we will compare to
 * @param {string} compared String of the PVP achievement title that will be compared
 * @returns An int value equivalent to their sorting order
'''


def sortPVPSeasons(comparator, compared):
    global allExpansions
    substringValueComparator = getExpansionFromString(comparator)
    substringValueCompared = getExpansionFromString(compared)
    comparedExpansion = None
    ComparatorExpansion = None
    for expansion in allExpansions:
        if expansion["name"] == substringValueCompared:
            comparedExpansion = expansion
        if expansion["name"] == substringValueComparator:
            ComparatorExpansion = expansion
        if comparedExpansion and ComparatorExpansion:
            break
    return (
        comparedExpansion["id"] - ComparatorExpansion["id"] or
        int(compared[len(compared) - 1: len(compared)]) -
        int(comparator[len(comparator) - 1: len(comparator)]))
