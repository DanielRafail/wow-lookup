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
    let recentData = [];
    Object.entries(mythicPlusAlternate).map((entry, i) => {
      if (entry[1].affixes[0].name === "Tyrannical") {
        keys = pushToDictionary(keys, mythicPlusBest[i], entry[1]);
      } else {
        keys = pushToDictionary(keys, entry[1], mythicPlusBest[i]);
      }
      const seperatedDateElements = mythicPlusRecent[i].completed_at
        .substring(0, mythicPlusRecent[i].completed_at.indexOf("T"))
        .split("-");
      recentData.push({
        dungeons:
          mythicPlusRecent[i].short_name +
          " " +
          calculateUpgrades(
            mythicPlusRecent[i].mythic_level,
            mythicPlusRecent[i].num_keystone_upgrades
          ),
        date:
          seperatedDateElements[1] +
          "/" +
          seperatedDateElements[2] +
          "/" +
          seperatedDateElements[0],
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
  static parseWowlogsData(wowlogsData) {
    const lfr = parseWowlogsDataTiers(wowlogsData.data.characterData.lfr);
    const normal = parseWowlogsDataTiers(wowlogsData.data.characterData.normal);
    const heroic = parseWowlogsDataTiers(wowlogsData.data.characterData.heroic);
    const mythic = parseWowlogsDataTiers(wowlogsData.data.characterData.mythic);
    let mainParseDifficulty = verifyMainParses(
      wowlogsData.data.characterData.normal,
      wowlogsData.data.characterData.heroic,
      wowlogsData.data.characterData.mythic
    );
    const mainSpec = findMainSpec(
      mainParseDifficulty,
      wowlogsData.data.characterData.lfr.overall.metric,
      wowlogsData.data.characterData.normal.overall.metric,
      wowlogsData.data.characterData.heroic.overall.metric,
      wowlogsData.data.characterData.mythic.overall.metric
    );
    return {
      tableData: {
        lfr: lfr,
        normal: normal,
        heroic: heroic,
        mythic: mythic,
      },
      mainSpec: mainSpec,
      mainParseDifficulty: mainParseDifficulty,
    };
  }

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

/**
 * Verify if the initial parses shown will be normal, heroic or mythic. No need to verify LFR as it will be the fallback
 * @param {Object} normal Dictionary containing the normal parses
 * @param {Object} heroic Dictionary containing the heroic parses
 * @param {Object} mythic Dictionary containing the mythic parses
 * @returns The highest tier with which you have parses
 */
function verifyMainParses(normal, heroic, mythic) {
  let normalKills = 0;
  let heroicKills = 0;
  let mythicKills = 0;
  mythic.overall.rankings.map((boss, i) => {
    if (boss && boss.totalKills > 0) mythicKills = mythicKills + 1;
    else if (heroic && heroic.overall.rankings[i].totalKills > 0)
      heroicKills = heroicKills + 1;
    else if (normal && normal.overall.rankings[i].totalKills > 0)
      normalKills = normalKills + 1;
  });
  return mythicKills > 0 ? 3 : heroicKills > 0 ? 2 : normalKills > 0 ? 1 : 0;
}

/**
 * Verify which difficulty is your highest and verify the spec you played at that difficulty
 * @param {int} difficulty Int which represents the difficulty level, 0 lfr, 1 normal, 2 heroic, 3 mythic 
 * @param {string} lfr String saying what your main spec in LFR is 
 * @param {string} normal String saying what your main spec in normal is 
 * @param {string} heroic String saying what your main spec in heroic is 
 * @param {string} mythic String saying what your main spec in mythic is 
 * @returns The string with your main spec for the highest tier
 */
function findMainSpec(difficulty, lfr, normal, heroic, mythic) {
  switch (difficulty) {
    case 0:
      return lfr.overall.metric;
    case 1:
      return normal.overall.metric;
    case 2:
      return heroic.overall.metric;
    case 3:
      return mythic.overall.metric;
    default:
      return -1;
  }
}

/**
 * Parses each tier to get the relevant information into a dictionary that will fit the table component
 * @param {Object} tier Dictionary holding the information regarding this tier 
 * @returns New custom made dictionary with the information put in a covenient form
 */
function parseWowlogsDataTiers(tier) {
  let returnDictionary = [];
  Object.entries(tier.overall.rankings).map((entry, i) => {
    returnDictionary.push({
      boss: entry[1].encounter.name,
      overall: entry[1].rankPercent ? Math.round(entry[1].rankPercent) : "-",
      ilvl: tier.ilvl.rankings[i].rankPercent
        ? Math.round(tier.ilvl.rankings[i].rankPercent)
        : "-",
      dps: tier.ilvl.rankings[i].rankPercent
        ? Math.round(entry[1].bestAmount)
        : "-",
      killCount: entry[1].totalKills,
    });
  });
  return returnDictionary;
}

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
