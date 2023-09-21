
'''
   * Parses the data of raiderIO into usable dictionaries
   * @param {Object} raiderIOData The data dictionary we get from the raiderIO APIs
   * @param {Object} Colors Raider IO colors JSON
   * @param {Object} allDungeons All dungeons as JSON
   * @returns A usable dictionary
'''


def parseRaiderIOData(raiderIOData):
    mythicPlusBest = raiderIOData["mythic_plus_best_runs"]
    mythicPlusAlternate = raiderIOData["mythic_plus_alternate_runs"]
    mythicPlusRecent = raiderIOData["mythic_plus_recent_runs"]
    MythicPlusScore = raiderIOData["mythic_plus_scores_by_season"]
    raiderIOPlayedResults = getRaiderIOIfPlayed(
        mythicPlusBest,
        mythicPlusAlternate,
        mythicPlusRecent
    )
    return {
        "keys": raiderIOPlayedResults["keys"],
        "recentRuns": raiderIOPlayedResults["recentData"],
        "score": MythicPlusScore[0]["scores"]
    }


'''
 * def to create dungeons if the player played
 * @param {Object} mythicPlusBest Dictionary with best runs
 * @param {Object} mythicPlusAlternate Dictionary with alternate runs
 * @param {Object} mythicPlusRecent Dictionary with recent runs
 * @param {Object} allDungeons Dictionary with all the dungeons this season
 * @returns the key and recent data dictionaries
'''


def getRaiderIOIfPlayed(mythicPlusBestKeys, mythicPlusAlternateKeys, mythicPlusRecent):
    bothWeeksAllDungeons = []
    recentDungeonData = []
    for i, mythicPlusBestDungeon in enumerate(mythicPlusBestKeys):
        if mythicPlusBestDungeon:
            bothWeeksAllDungeons.append(getMythicKeyBest(
                mythicPlusBestDungeon, mythicPlusAlternateKeys, mythicPlusBestDungeon["affixes"][0]["name"]))
        else:
            bothWeeksAllDungeons.append({"dungeon": mythicPlusBestDungeon["name"],
                                         "tyrannical": "-", "fortified": "-"})
        seperatedDateElements = mythicPlusBestDungeon[
            "completed_at"][0: mythicPlusBestDungeon["completed_at"].index("T")].split("-")
    
    for i, mythicPlusRecentDungeon in enumerate(mythicPlusRecent):
        seperatedDateElements = mythicPlusRecentDungeon[
            "completed_at"][0: mythicPlusRecentDungeon["completed_at"].index("T")].split("-")
        recentDungeonData.append({
            "dungeons": mythicPlusRecentDungeon["dungeon"],
            "key": calculateUpgrades(
                mythicPlusRecentDungeon["mythic_level"],
                mythicPlusRecentDungeon["num_keystone_upgrades"]
            ),
            "date": seperatedDateElements[1] +
            "/" +
            seperatedDateElements[2] +
            "/" +
            seperatedDateElements[0],
        })
    return {"keys": bothWeeksAllDungeons, "recentData": recentDungeonData}


'''
 * Calculate the amount of + to add infront of a string to display the amount of upgrades received when finishing a key
 * @param {string} key_level the initial key level
 * @param {string} num_keystone_upgrades the number of upgrades on the key
 * @returns An amount of + equal to the keystone upgrade followed by the key level
'''


def calculateUpgrades(key_level, num_keystone_upgrades):
    keyUpgrade = ""
    for i in range(num_keystone_upgrades):
        keyUpgrade = keyUpgrade + "+"
    return keyUpgrade + str(key_level)


'''
 * Push an entry into a dict. The first entry goes into a tyrannical key, the second entry into a fortified key
 * @param {Dictionary} mythicPlusBestDungeon The first dictionary which will be added to tyrannical keys
 * @param {Dictionary} mythicPlusAlternateKeys The second dictionary which will be added to fortified keys
 * @param {String} weeklyAffix String of the weekly affix name
 * @returns The dictionary onbject after it has been pushed
'''


def getMythicKeyBest(mythicPlusBestDungeon, mythicPlusAlternateKeys, weeklyAffix):
    alternateDungeon = None
    for dungeon in mythicPlusAlternateKeys:
        if mythicPlusBestDungeon["dungeon"] == dungeon["dungeon"]:
            alternateDungeon = dungeon
            break
    mythicPlusBest = calculateUpgrades(
        mythicPlusBestDungeon["mythic_level"],
        mythicPlusBestDungeon["num_keystone_upgrades"]
    ) if mythicPlusBestDungeon else "-"
    alternate = calculateUpgrades(alternateDungeon["mythic_level"], alternateDungeon["num_keystone_upgrades"]
                                  ) if alternateDungeon else "-"
    if (weeklyAffix == "Tyrannical"):
        return {
            "dungeon": mythicPlusBestDungeon["dungeon"],
            "tyrannical": mythicPlusBest,
            "fortified": alternate}
    else:
        return {
            "dungeon": mythicPlusBestDungeon["dungeon"],
            "tyrannical": alternate,
            "fortified": mythicPlusBest,
        }
