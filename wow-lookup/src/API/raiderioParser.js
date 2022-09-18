import "../CSS/main.css";
import React from "react";
import Helper from "../Helper/helper.js";

/**
 * The Parser class which will take the input from the raiderio API and convert them into usable dictionaries for dungeon purposes
 */
class RaiderIOParser extends React.Component {
  /**
   * Parses the data of raiderIO into usable dictionaries
   * @param {Object} raiderIOData The data dictionary we get from the raiderIO APIs
   * @returns A usable dictionary
   */
  static parseRaiderIOData(raiderIOData) {
    const mythicPlusBest =
      raiderIOData.data.raiderIOScores.mythic_plus_best_runs;
    const mythicPlusAlternate =
      raiderIOData.data.raiderIOScores.mythic_plus_alternate_runs;
    const mythicPlusRecent =
      raiderIOData.data.raiderIOScores.mythic_plus_recent_runs;
    const MythicPlusScore =
      raiderIOData.data.raiderIOScores.mythic_plus_scores_by_season;
    const raiderIOPlayedResults = getRaiderIOIfPlayed(
      mythicPlusBest,
      mythicPlusAlternate,
      mythicPlusRecent,
      raiderIOData.data.allDungeons.seasons[0].dungeons
    );
    return {
      keys: raiderIOPlayedResults.keys,
      recentRuns: raiderIOPlayedResults.recentData,
      score: MythicPlusScore[0].scores,
      allDungeons: raiderIOData.data.allDungeons.seasons[0].dungeons,
      scoreColors: raiderIOData.data.scoreColors,
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
  mythicPlusRecent,
  allDungeons
) {
  let keys = [];
  let recentData = [];
  allDungeons.map((entry, i) => {
    if (
      mythicPlusBest[i] &&
      mythicPlusBest[i].affixes[0].name === "Tyrannical"
    ) {
      keys = pushToDictionary(keys, mythicPlusAlternate[i], mythicPlusBest[i]);
    } else if (mythicPlusBest[i]) {
      keys = pushToDictionary(keys, mythicPlusAlternate[i], mythicPlusBest[i]);
    } else {
      keys.push({ dungeon: entry.name, tyrannical: "-", fortified: "-" });
    }
    const seperatedDateElements = mythicPlusRecent[i]
      ? mythicPlusRecent[i].completed_at
          .substring(0, mythicPlusRecent[i].completed_at.indexOf("T"))
          .split("-")
      : null;
    recentData.push({
      dungeons: entry.name,
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
function pushToDictionary(dict, entry, secondEntry) {
  dict.push({
    dungeon: secondEntry.dungeon,
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
  return dict;
}
