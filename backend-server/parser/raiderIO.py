
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


def getRaiderIOIfPlayed(mythicPlusBest, mythicPlusAlternate, mythicPlusRecent):
    keys = []
    recentData = []
    counter = 0
    for entry in mythicPlusBest:
        print(entry)
        if entry:
            if entry["affixes"][0]["name"] == "Tyrannical":
                pushToDictionary(keys, entry, mythicPlusAlternate, True)
            else:
                pushToDictionary(keys, entry, mythicPlusAlternate, False)
        else:
            keys.append({"dungeon": entry["name"],
                        "tyrannical": "-", "fortified": "-"})
        seperatedDateElements = mythicPlusRecent[counter] if mythicPlusRecent[counter][
            "completed_at"][0: mythicPlusRecent[counter]["completed_at"].index("T")].split("-") else None
        recentData.append({
            "dungeons": mythicPlusRecent[counter]["dungeon"],
            "key": mythicPlusRecent[counter]
            if calculateUpgrades(
                mythicPlusRecent[counter]["mythic_level"],
                mythicPlusRecent[counter]["num_keystone_upgrades"]
            )
            else "-",
            "date": seperatedDateElements[1] +
            "/" +
            seperatedDateElements[2] +
            "/" +
            seperatedDateElements[0]
            if len(seperatedDateElements) == 3
            else "-",
        })
        counter += 1
    return {"keys": keys, "recentData": recentData}


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
 * @param {Object} dict The dictionary we will be pushing to
 * @param {Dictionary} entry The first dictionary which will be added to tyrannical keys
 * @param {Dictionary} secondEntry The second dictionary which will be added to fortified keys
 * @returns The dictionary onbject after it has been pushed
'''


def pushToDictionary(dictContainer, entry, secondEntryJSON, bool):
    secondEntry = None
    count = 0
    for item in secondEntryJSON:
        if secondEntryJSON[count]["dungeon"] == item["dungeon"]:
            secondEntry = secondEntryJSON[count]
            break
        count += 1
    if (bool == False):
        dictContainer.append({
            "dungeon": entry["dungeon"],
            "tyrannical": entry
            if calculateUpgrades(
                entry["mythic_level"], entry["num_keystone_upgrades"]
            ) else "-",
            "fortified": secondEntry
            if calculateUpgrades(
                secondEntry["mythic_level"],
                secondEntry["num_keystone_upgrades"]
            ) else "-"})
    else:
        dictContainer.append({
            "dungeon": entry["dungeon"],
            "tyrannical": secondEntry if calculateUpgrades(secondEntry["mythic_level"], secondEntry["num_keystone_upgrades"]) else "-",
            "fortified": entry if calculateUpgrades(
                entry["mythic_level"],
                entry["num_keystone_upgrades"]
            ) else "-",
        })
