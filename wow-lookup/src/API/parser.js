import "../CSS/main.css";
import React from "react";

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
    Object.entries(mythicPlusAlternate).map((entry, i) => {
      if (entry[1].affixes[0].name === "Tyrannical") {
        keys.push({
          dungeon: entry[1].dungeon,
          tyrannical: calculateUpgrades(
            entry[1].mythic_level,
            entry[1].num_keystone_upgrades
          ),
          fortified: calculateUpgrades(
            mythicPlusBest[i].mythic_level,
            mythicPlusBest[i].num_keystone_upgrades
          ),
        });
      } else {
        keys.push({
          dungeon: entry[1].dungeon,
          tyrannical: calculateUpgrades(
            mythicPlusBest[i].mythic_level,
            mythicPlusBest[i].num_keystone_upgrades
          ),
          fortified: calculateUpgrades(
            entry[1].mythic_level,
            entry[1].num_keystone_upgrades
          ),
        });
      }
    });
    return {
      keys: keys,
      recentRuns: mythicPlusRecent,
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
    keyUpgrade= keyUpgrade.concat("+");
  }
  return keyUpgrade.concat(key_level);
}
