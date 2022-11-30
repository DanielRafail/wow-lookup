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
    let roles = ["DPS", "HPS", "Tank"];
    const lfrDPS = parseWowlogsDataTiers(
      characterData.lfr,
      roles[0],
      classesData,
      characterData.character.classID
    );
    const normalDPS = parseWowlogsDataTiers(
      characterData.normal,
      roles[0],
      classesData,
      characterData.character.classID
    );
    const heroicDPS = parseWowlogsDataTiers(
      characterData.heroic,
      roles[0],
      classesData,
      characterData.character.classID
    );
    const mythicDPS = parseWowlogsDataTiers(
      characterData.mythic,
      roles[0],
      classesData,
      characterData.character.classID
    );
    const lfrHealer = parseWowlogsDataTiers(
      characterData.lfr,
      roles[1],
      characterData.character,
      classesData,
      characterData.character.classID
    );
    const normalHealer = parseWowlogsDataTiers(
      characterData.normal,
      roles[1],
      classesData,
      characterData.character.classID
    );
    const heroicHealer = parseWowlogsDataTiers(
      characterData.heroic,
      roles[1],
      classesData,
      characterData.character.classID
    );
    const mythicHealer = parseWowlogsDataTiers(
      characterData.mythic,
      roles[1],
      classesData,
      characterData.character.classID
    );
    const lfrTank = parseWowlogsDataTiers(
      characterData.lfr,
      roles[2],
      classesData,
      characterData.character.classID
    );
    const normalTank = parseWowlogsDataTiers(
      characterData.normal,
      roles[2],
      classesData,
      characterData.character.classID
    );
    const heroicTank = parseWowlogsDataTiers(
      characterData.heroic,
      roles[2],
      classesData,
      characterData.character.classID
    );
    const mythicTank = parseWowlogsDataTiers(
      characterData.mythic,
      roles[2],
      classesData,
      characterData.character.classID
    );
    let dps = verifyRoleAverageParse(
      characterData.lfr,
      characterData.normal,
      characterData.heroic,
      characterData.mythic,
      roles[0]
    );
    let hps = verifyRoleAverageParse(
      characterData.lfr,
      characterData.normal,
      characterData.heroic,
      characterData.mythic,
      roles[1]
    );
    let tank = verifyRoleAverageParse(
      characterData.lfr,
      characterData.normal,
      characterData.heroic,
      characterData.mythic,
      roles[2]
    );
    const mainParsePerDifficulty = findMainParsePerDifficulty(dps, hps, tank);
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
      highestDifficulty: mainParsePerDifficulty.mythic
        ? 4
        : mainParsePerDifficulty.heroic
        ? 3
        : mainParsePerDifficulty.normal
        ? 2
        : mainParsePerDifficulty.normal
        ? 1
        : 0,
      mainParsePerDifficulty: mainParsePerDifficulty,
      class:
        characterData.character.classID && classesData.data
          ? classesData.data[
              Helper.blizzardClassIDToWowlogsClassID(
                characterData.character.classID
              )
            ].name
          : null,
    };
  }
}
export default WowlogsParser;

/**
 * Finds the highest spec you parse with per difficulty
 * @param {Object} dps Dictionary holding the dps parses
 * @param {Object} hps Dictionary holding the hps parses
 * @param {Object} tank Dictionary holding the tank parses
 * @returns Dictionary with the highest spec per tier
 */
function findMainParsePerDifficulty(dps, hps, tank) {
  let mainParsePerDifficulty = {
    lfr: {},
    normal: {},
    heroic: {},
    mythic: {},
  };
  const allParses = { DPS: dps, Healer: hps, Tank: tank };
  Object.keys(mainParsePerDifficulty).map((difficulty, i) => {
    let highestParseAveragePerDifficulty = 0;
    let entryIndex = -1;
    Object.values(allParses).map((roleParse, j) => {
      if (highestParseAveragePerDifficulty < roleParse[difficulty]) {
        highestParseAveragePerDifficulty = roleParse[difficulty];
        entryIndex = j;
      }
      return null;
    });
    mainParsePerDifficulty[difficulty] = Object.keys(allParses)[entryIndex];
    return null;
  });
  return mainParsePerDifficulty;
}

/**
 * Return the average parse for a given role
 * @param {Object} normal Dictionary containing the normal parses
 * @param {Object} heroic Dictionary containing the heroic parses
 * @param {Object} mythic Dictionary containing the mythic parses
 * @returns Dictionary containing average parses per tier for a given role
 */
function verifyRoleAverageParse(LFR, normal, heroic, mythic, metric) {
  let mythicScore = 0;
  let heroicScore = 0;
  let normalScore = 0;
  let LFRScore = 0;
  let bossKills = 0;
  for (var i = 0; i < mythic["overall".concat(metric)].rankings.length; i++) {
    if (
      mythic["overall".concat(metric)].rankings[i] &&
      mythic["overall".concat(metric)].rankings[i].totalKills > 0
    ) {
      mythicScore = mythic["overall".concat(metric)].rankings[i].allStars
        ? mythicScore +
          mythic["overall".concat(metric)].rankings[i].allStars.points
        : mythicScore;
    }
    if (heroic && heroic["overall".concat(metric)].rankings[i].totalKills > 0) {
      heroicScore = heroic["overall".concat(metric)].rankings[i].allStars
        ? heroicScore +
          heroic["overall".concat(metric)].rankings[i].allStars.points
        : heroicScore;
    }
    if (normal && normal["overall".concat(metric)].rankings[i].totalKills > 0) {
      normalScore = normal["overall".concat(metric)].rankings[i].allStars
        ? normalScore +
          normal["overall".concat(metric)].rankings[i].allStars.points
        : normalScore;
    } else {
      LFRScore = LFR["overall".concat(metric)].rankings[i].allStars
        ? LFRScore + LFR["overall".concat(metric)].rankings[i].allStars.points
        : LFRScore;
    }
    bossKills = bossKills + 1;
  }
  return {
    mythic: mythicScore / bossKills,
    heroic: heroicScore / bossKills,
    normal: normalScore / bossKills,
    lfr: LFRScore / bossKills,
  };
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
