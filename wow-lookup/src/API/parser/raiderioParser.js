import React from "react";

/**
 * The Parser class which will take the input from the raiderio API and convert them into usable dictionaries for dungeon purposes
 */
class RaiderIOParser extends React.Component {
  /**
   * Parses the data of raiderIO into usable dictionaries
   * @param {Object} raiderIOData The data dictionary we get from the raiderIO APIs
   * @returns A usable dictionary
   */
  static parseRaiderIOData(raiderIOData, colors, allDungeons) {
    const mythicPlusBest = raiderIOData.mythic_plus_best_runs;
    const mythicPlusAlternate = raiderIOData.mythic_plus_alternate_runs;
    const mythicPlusRecent = raiderIOData.mythic_plus_recent_runs;
    const MythicPlusScore = raiderIOData.mythic_plus_scores_by_season;
    const raiderIOPlayedResults = getRaiderIOIfPlayed(
      mythicPlusBest,
      mythicPlusAlternate,
      mythicPlusRecent
    );
    return {
      keys: raiderIOPlayedResults.keys,
      recentRuns: raiderIOPlayedResults.recentData,
      score: MythicPlusScore[0].scores,
      allDungeons: allDungeons.seasons[0].dungeons,
      scoreColors: colors,
    };
  }
}
export default RaiderIOParser;

/**
 * Function to create dungeons if the player played
 * @param {Object} mythicPlusBest Dictionary with best runs
 * @param {Object} mythicPlusAlternate Dictionary with alternate runs
 * @param {Object} mythicPlusRecent Dictionary with recent runs
 * @param {Object} allDungeons Dictionary with all the dungeons this season
 * @returns the key and recent data dictionaries
 */
function getRaiderIOIfPlayed(
  mythicPlusBest,
  mythicPlusAlternate,
  mythicPlusRecent
) {
  let keys = [];
  let recentData = [];
  mythicPlusBest.map((entry, i) => {
    if (entry) {
      if(entry.affixes[0].name === "Tyrannical")
        keys = pushToDictionary(keys, entry, mythicPlusAlternate, true);
      else
        keys = pushToDictionary(keys, entry, mythicPlusAlternate, false);
    } else {
      keys.push({ dungeon: entry.name, tyrannical: "-", fortified: "-" });
    }
    const seperatedDateElements = mythicPlusRecent[i]
      ? mythicPlusRecent[i].completed_at
          .substring(0, mythicPlusRecent[i].completed_at.indexOf("T"))
          .split("-")
      : null;
    recentData.push({
      dungeons: mythicPlusRecent[i].dungeon,
      key: mythicPlusRecent[i]
        ? calculateUpgrades(
            mythicPlusRecent[i].mythic_level,
            mythicPlusRecent[i].num_keystone_upgrades
          )
        : "-",
      date: seperatedDateElements
        ? seperatedDateElements[1] +
          "/" +
          seperatedDateElements[2] +
          "/" +
          seperatedDateElements[0]
        : "-",
    });
    return null;
  });
  return { keys: keys, recentData: recentData };
}

/**
 * Calculate the amount of + to add infront of a string to display the amount of upgrades received when finishing a key
 * @param {string} key_level the initial key level
 * @param {string} num_keystone_upgrades the number of upgrades on the key
 * @returns An amount of + equal to the keystone upgrade followed by the key level
 */
function calculateUpgrades(key_level, num_keystone_upgrades) {
  let keyUpgrade = "";
  for (let i = 0; i < num_keystone_upgrades; i++) {
    keyUpgrade = keyUpgrade.concat("+");
  }
  return keyUpgrade.concat(key_level);
}

/**
 * Push an entry into a dict. The first entry goes into a tyrannical key, the second entry into a fortified key
 * @param {Object} dict The dictionary we will be pushing to
 * @param {Dictionary} entry The first dictionary which will be added to tyrannical keys
 * @param {Dictionary} secondEntry The second dictionary which will be added to fortified keys
 * @returns The dictionary onbject after it has been pushed
 */
function pushToDictionary(dict, entry, secondEntryJSON, bool) {
  let secondEntry = null;
  for (let item in secondEntryJSON) {
    if (secondEntryJSON[item].dungeon === entry.dungeon) {
      secondEntry = secondEntryJSON[item];
      break;
    }
  }
  if (!bool) {
    dict.push({
      dungeon: entry.dungeon,
      tyrannical: entry
        ? calculateUpgrades(entry.mythic_level, entry.num_keystone_upgrades)
        : "-",
      fortified: secondEntry
        ? calculateUpgrades(
            secondEntry.mythic_level,
            secondEntry.num_keystone_upgrades
          )
        : "-",
    });
  } else {
    dict.push({
      dungeon: entry.dungeon,
      tyrannical: secondEntry
        ? calculateUpgrades(secondEntry.mythic_level, secondEntry.num_keystone_upgrades)
        : "-",
      fortified: entry
        ? calculateUpgrades(
          entry.mythic_level,
          entry.num_keystone_upgrades
          )
        : "-",
    });
  }
  return dict;
}
