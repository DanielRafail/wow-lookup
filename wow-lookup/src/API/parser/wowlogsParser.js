import React from "react";
import Helper from "../../Helper/helper.js";

/**
 * The Parser class which will take the input from the wowlogs API and convert them into usable dictionaries for raid purposes
 */
class WowlogsParser extends React.Component {
  /**
   * Parses the data of wowlogs into usable dictionaries
   * @param {Object} wowlogsData The data dictionary we get from the wowlogs APIs
   * @returns A usable dictionary
   */
  static parseWowlogsData(wowlogsData) {
    const characterData = wowlogsData.data.data.characterData;
    const lfrDPS = parseWowlogsDataTiers(
      characterData.lfr,
      "DPS",
      characterData.character
    );
    const normalDPS = parseWowlogsDataTiers(
      characterData.normal,
      "DPS",
      characterData.character
    );
    const heroicDPS = parseWowlogsDataTiers(
      characterData.heroic,
      "DPS",
      characterData.character
    );
    const mythicDPS = parseWowlogsDataTiers(
      characterData.mythic,
      "DPS",
      characterData.character
    );
    const lfrHealer = parseWowlogsDataTiers(
      characterData.lfr,
      "HPS",
      characterData.character
    );
    const normalHealer = parseWowlogsDataTiers(
      characterData.normal,
      "HPS",
      characterData.character
    );
    const heroicHealer = parseWowlogsDataTiers(
      characterData.heroic,
      "HPS",
      characterData.character
    );
    const mythicHealer = parseWowlogsDataTiers(
      characterData.mythic,
      "HPS",
      characterData.character
    );
    const lfrTank = parseWowlogsDataTiers(
      characterData.lfr,
      "Tank",
      characterData.character
    );
    const normalTank = parseWowlogsDataTiers(
      characterData.normal,
      "Tank",
      characterData.character
    );
    const heroicTank = parseWowlogsDataTiers(
      characterData.heroic,
      "Tank",
      characterData.character
    );
    const mythicTank = parseWowlogsDataTiers(
      characterData.mythic,
      "Tank",
      characterData.character
    );
    let mainParseDifficulty = verifyMainParses(
      characterData.normal,
      characterData.heroic,
      characterData.mythic,
      "DPS"
    );
    return {
      tableData: {
        DPS: {
          lfr: lfrDPS,
          normal: normalDPS,
          heroic: heroicDPS,
          mythic: mythicDPS,
        },
        Healer: {
          lfr: lfrHealer,
          normal: normalHealer,
          heroic: heroicHealer,
          mythic: mythicHealer,
        },
        Tank: {
          lfr: lfrTank,
          normal: normalTank,
          heroic: heroicTank,
          mythic: mythicTank,
        },
      },
      mainParseDifficulty: mainParseDifficulty,
      class: characterData.character.gameData.global.character_class.name,
    };
  }
}
export default WowlogsParser;

/**
 * Verify if the initial parses shown will be normal, heroic or mythic. No need to verify LFR as it will be the fallback
 * @param {Object} normal Dictionary containing the normal parses
 * @param {Object} heroic Dictionary containing the heroic parses
 * @param {Object} mythic Dictionary containing the mythic parses
 * @returns The highest tier with which you have parses
 */
function verifyMainParses(normal, heroic, mythic, metric) {
  let normalKills = 0;
  let heroicKills = 0;
  let mythicKills = 0;
  mythic["overall".concat(metric)].rankings.map((boss, i) => {
    if (boss && boss.totalKills > 0) mythicKills = mythicKills + 1;
    else if (
      heroic &&
      heroic["overall".concat(metric)].rankings[i].totalKills > 0
    )
      heroicKills = heroicKills + 1;
    else if (
      normal &&
      normal["overall".concat(metric)].rankings[i].totalKills > 0
    )
      normalKills = normalKills + 1;
    return null;
  });
  return mythicKills > 0 ? 4 : heroicKills > 0 ? 3 : normalKills > 0 ? 2 : 1;
}

/**
 * Parses each tier to get the relevant information into a dictionary that will fit the table component
 * @param {Object} tier Dictionary holding the information regarding this tier
 * @param {string} metric The metric to be used (HPS or DPS)
 * @returns New custom made dictionary with the information put in a covenient form
 */
function parseWowlogsDataTiers(tier, metric, characterInfo) {
  let returnDictionary = { spec: [], data: [] };
  const overallMetric = tier["overall".concat(metric)];
  const ilvlMetric = tier["ilvl".concat(metric)];
  let specID;
  Object.values(overallMetric.rankings).map((entry, i) => {
    !characterInfo.gameData.error
      ? characterInfo.gameData.talents.specializations.map((spec, j) => {
          //includes because will concat specs that have same name to save headache
          if (
            entry.spec && Helper.getSpecIDFromName(entry.spec).toString().includes(
              spec.specialization.id.toString()
            )
          )
            specID = spec.specialization.id;
          return null;
        })
      : (specID = null);
    returnDictionary.data.push({
      boss: entry.encounter.name,
      overall: entry.rankPercent ? Math.round(entry.rankPercent) + "%" : "-",
      ilvl: ilvlMetric.rankings[i].rankPercent
        ? Math.round(ilvlMetric.rankings[i].rankPercent) + "%"
        : "-",
      [metric]: ilvlMetric.rankings[i].rankPercent
        ? Math.round(entry.bestAmount).toLocaleString("en-US")
        : "-",
      killCount: entry.totalKills,
    });
    !characterInfo.gameData.error
      ? returnDictionary.spec.push({ spec: entry.spec, specID: specID })
      : returnDictionary.spec.push({ spec: entry.spec });
    return null;
  });
  return returnDictionary;
}
