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
  static parseWowlogsData(wowlogsData, classesData) {
    const characterData = wowlogsData.data.data.characterData;
    const lfrDPS = parseWowlogsDataTiers(
      characterData.lfr,
      "DPS",
      classesData,
      characterData.character.classID
    );
    const normalDPS = parseWowlogsDataTiers(
      characterData.normal,
      "DPS",
      classesData,
      characterData.character.classID
    );
    const heroicDPS = parseWowlogsDataTiers(
      characterData.heroic,
      "DPS",
      classesData,
      characterData.character.classID
    );
    const mythicDPS = parseWowlogsDataTiers(
      characterData.mythic,
      "DPS",
      classesData,
      characterData.character.classID
    );
    const lfrHealer = parseWowlogsDataTiers(
      characterData.lfr,
      "HPS",
      characterData.character,
      classesData,
      characterData.character.classID
    );
    const normalHealer = parseWowlogsDataTiers(
      characterData.normal,
      "HPS",
      classesData,
      characterData.character.classID
    );
    const heroicHealer = parseWowlogsDataTiers(
      characterData.heroic,
      "HPS",
      classesData,
      characterData.character.classID
    );
    const mythicHealer = parseWowlogsDataTiers(
      characterData.mythic,
      "HPS",
      classesData,
      characterData.character.classID
    );
    const lfrTank = parseWowlogsDataTiers(
      characterData.lfr,
      "Tank",
      classesData,
      characterData.character.classID
    );
    const normalTank = parseWowlogsDataTiers(
      characterData.normal,
      "Tank",
      classesData,
      characterData.character.classID
    );
    const heroicTank = parseWowlogsDataTiers(
      characterData.heroic,
      "Tank",
      classesData,
      characterData.character.classID
    );
    const mythicTank = parseWowlogsDataTiers(
      characterData.mythic,
      "Tank",
      classesData,
      characterData.character.classID
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
      class:
        characterData.character.classID && classesData.data
          ? classesData.data[ Helper.blizzardClassIDToWowlogsClassID(characterData.character.classID)].name
          : null,
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

function verifyMainMetric(normal, heroic, mythic) {
  mythic["overallDPS"].rankings.map((boss, i) => {});
}

/**
 * Parse the logs for each tier for each role
 * @param {Object} tier Dictionary representing the tier
 * @param {string} metric Role being parsed
 * @param {Object} classesData Dictionary holding classes and specs
 * @param {int} classID The id of the class currently being parsed
 * @returns Dictionary with parsed information
 */
function parseWowlogsDataTiers(tier, metric, classesData, classID) {
  let returnDictionary = { spec: [], data: [] };
  const overallMetric = tier["overall".concat(metric)];
  const ilvlMetric = tier["ilvl".concat(metric)];
  let specID;
  Object.values(overallMetric.rankings).map((entry, i) => {
    classesData.data
      ? classesData.data[
          Helper.blizzardClassIDToWowlogsClassID(classID)
        ].specs.map((spec, j) => {
          if (entry.spec && entry.spec === spec.name) specID = spec.id;
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
    classesData.data
      ? returnDictionary.spec.push({ spec: entry.spec, specID: specID })
      : returnDictionary.spec.push({ spec: entry.spec });
    return null;
  });
  return returnDictionary;
}
