import "../CSS/main.css";
import React from "react";
import Helper from "../Helper/helper.js"

/**
 * Push an entry into a dict. The first entry goes into a tyrannical key, the second entry into a fortified key
 * @param {Object} dict The dictionary we will be pushing to
 * @param {*} entry The first entry which will be added to tyrannical keys
 * @param {*} secondEntry The second entry which will be added to fortified keys
 * @returns The dictionary onbject after it has been pushed
 */
function pushToDictionary(dict, entry, secondEntry) {
  dict.push({
    dungeon: entry.dungeon,
    tyrannical: calculateUpgrades(
      entry.mythic_level,
      entry.num_keystone_upgrades
    ),
    fortified: calculateUpgrades(
      secondEntry.mythic_level,
      secondEntry.num_keystone_upgrades
    ),
  });
  return dict;
}

/**
 * The Parser class which will take all the inputs from the APIs and convert them into usable dictionaries
 */
class Parser extends React.Component {
  /**
   * Parses the data of raiderIO into usable dictionaries
   * @param {Object} raiderIOData The data dictionary we get from the raiderIO APIs
   * @returns A usable dictionary
   */
  static parseRaiderIOData(raiderIOData) {
    const mythicPlusAlternate = raiderIOData.mythic_plus_alternate_runs;
    const mythicPlusBest = raiderIOData.mythic_plus_best_runs;
    const mythicPlusRecent = raiderIOData.mythic_plus_recent_runs;
    const MythicPlusScore = raiderIOData.mythic_plus_scores_by_season;
    let keys = [];
    let recentData = [];
    Object.entries(mythicPlusAlternate).map((entry, i) => {
      if (entry[1].affixes[0].name === "Tyrannical") {
        keys = pushToDictionary(keys, mythicPlusBest[i], entry[1]);
      } else {
        keys = pushToDictionary(keys, entry[1], mythicPlusBest[i]);
      }
      const seperatedDataElements = mythicPlusRecent[i].completed_at.substring(0, mythicPlusRecent[i].completed_at.indexOf("T")).split("-");
      recentData.push({
        dungeons:
          mythicPlusRecent[i].short_name +
          " " +
          calculateUpgrades(
            mythicPlusRecent[i].mythic_level,
            mythicPlusRecent[i].num_keystone_upgrades
          ),
        date: seperatedDataElements[1] + "/" + seperatedDataElements[2] + "/" + seperatedDataElements[0],
      });
    });
    return {
      keys: keys,
      recentRuns: recentData,
      score: MythicPlusScore[0].scores,
    };
  }

  /**
   * Parses the data of wowlogs into usable dictionaries
   * @param {Object} wowlogsData The data dictionary we get from the wowlogs APIs
   * @returns A usable dictionary
   */
  static parseWowlogsData(wowlogsData) {}

  /**
   * Parses the data of checkPVP into usable dictionaries
   * @param {Object} checkPVPData The data dictionary we get from the checkPVP APIs
   * @returns A usable dictionary
   */
  static parseCheckPVPData(checkPVPData) {}
}

export default Parser;

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
