import "../CSS/main.css";
import React from "react";
import Helper from "../Helper/helper.js";

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
    const mythicPlusBest =
      raiderIOData.raiderIOScores.data.mythic_plus_best_runs;
    const mythicPlusAlternate =
      raiderIOData.raiderIOScores.data.mythic_plus_alternate_runs;
    const mythicPlusRecent =
      raiderIOData.raiderIOScores.data.mythic_plus_recent_runs;
    const MythicPlusScore =
      raiderIOData.raiderIOScores.data.mythic_plus_scores_by_season;
    const raiderIOPlayedResults = getRaiderIOIfPlayed(
      mythicPlusBest,
      mythicPlusAlternate,
      mythicPlusRecent,
      raiderIOData.allDungeons
    );
    return {
      keys: raiderIOPlayedResults.keys,
      recentRuns: raiderIOPlayedResults.recentData,
      score: MythicPlusScore[0].scores,
      allDungeons: raiderIOData.allDungeons,
      scoreColors: raiderIOData.scoreColors.data
    };
  }

  /**
   * Parses the data of wowlogs into usable dictionaries
   * @param {Object} wowlogsData The data dictionary we get from the wowlogs APIs
   * @returns A usable dictionary
   */
  static parseWowlogsData(wowlogsData) {
    const characterData = wowlogsData.data.data.characterData;
    const lfr = parseWowlogsDataTiers(characterData.lfr,"DPS");
    const normal = parseWowlogsDataTiers(characterData.normal,"DPS");
    const heroic = parseWowlogsDataTiers(characterData.heroic,"DPS");
    const mythic = parseWowlogsDataTiers(characterData.mythic,"DPS");
    let mainParseDifficulty = verifyMainParses(
      characterData.normal,
      characterData.heroic,
      characterData.mythic
    );
    return {
      tableData: {
        lfr: lfr,
        normal: normal,
        heroic: heroic,
        mythic: mythic,
      },
      mainParseDifficulty: mainParseDifficulty,
    };
  }

  /**
   * Parses the data of PVP into usable dictionaries
   * @param {Object} pvpData The data dictionary we get from the blizzard PVP APIs
   * @returns A usable dictionary
   */
  static parsePVPData(pvpData) {
    const pvpAchievs = getAllPVPAchievs(pvpData);
    const pvpSeasons = findEveryPVPSeason(pvpAchievs.pvpAchievs);
    const seasonsPerExpansions = divideSeasonsPerExpansion(pvpSeasons);
    findHighestPVPAchievBySeason(
      pvpAchievs.pvpAchievs,
      seasonsPerExpansions,
      pvpAchievs.doneOnThisChar
    );
    const twoRating = getRating(pvpData.two);
    const threeRating = getRating(pvpData.three);
    return {
      rankHistory: seasonsPerExpansions,
      twoRating: twoRating,
      threeRating: threeRating,
    };
  }
}

export default Parser;

/**
 * Function to create dungeons if the player played
 * @param {Object} mythicPlusBest Dictionary with best runs
 * @param {Object} mythicPlusAlternate Dictionary with alternate runs
 * @param {Object} mythicPlusRecent Dictionary with recent runs
 *  * @param {Object} allDungeons Dictionary with all the dungeons this season
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
    if (mythicPlusBest[i] && mythicPlusBest[i].affixes[0].name === "Tyrannical") {
      keys = pushToDictionary(keys, mythicPlusAlternate[i], mythicPlusBest[i]);
    } else if (mythicPlusBest[i]){
      keys = pushToDictionary(keys, mythicPlusAlternate[i], mythicPlusBest[i]);
    }
    else{
      keys.push({dungeon: entry.name, tyrannical: "-", fortified: "-"});
    }
    const seperatedDateElements = mythicPlusRecent[i] ? mythicPlusRecent[i].completed_at
      .substring(0, mythicPlusRecent[i].completed_at.indexOf("T"))
      .split("-") : null;
    recentData.push({
      dungeons: entry.name,
      key: mythicPlusRecent[i] ? calculateUpgrades(
        mythicPlusRecent[i].mythic_level,
        mythicPlusRecent[i].num_keystone_upgrades
      ) : "-",
      date: seperatedDateElements ? 
        seperatedDateElements[1] +
        "/" +
        seperatedDateElements[2] +
        "/" +
        seperatedDateElements[0] : "-"
    });
  });
  return { keys: keys, recentData: recentData };
}

/**
 * Create a dictionary object with keys for every expansion, and empty values
 * @param {*} seasons
 * @returns
 */
function divideSeasonsPerExpansion(seasons) {
  let previousSeason = "";
  let dividedSeasons = {};
  seasons.map((season, i) => {
    const currentSeasonEntry = getExpansionFromString(season);
    if (currentSeasonEntry !== previousSeason) {
      previousSeason = currentSeasonEntry;
      dividedSeasons[currentSeasonEntry] = [];
    }
    dividedSeasons[currentSeasonEntry].push({ [season]: "" });
  });
  return dividedSeasons;
}

/**
 * Get the rating and stats of a player has within a certain PVP bracket
 * @param {Object} bracket The pvp bracket
 * @returns the player's rating and weekly and season stats
 */
function getRating(bracket) {
  return {
    rating: bracket.data.rating,
    seasonStats: bracket.data.season_match_statistics,
    weeklyStats: bracket.data.weekly_match_statistics,
  };
}

/**
 * Within the array of every achievement, find all the PVP achievements
 * @param {Object} allAchievs Array with every achievement earned by the player
 * @returns An array with all the PVP achievements string names
 */
function getAllPVPAchievs(allAchievs) {
  let pvpAchievs = [];
  let doneOnThisChar = [];
  const pvpAchievsRegex = new RegExp("Season [0-9]$");
  allAchievs.achievements.data.achievements.map((achievement, i) => {
    if (pvpAchievsRegex.test(achievement.achievement.name)) {
      doneOnThisChar.push(achievement.criteria ? achievement.criteria.is_completed : true);
      //Returns only Warlords instead of Warlords of Draenor from APIs so have to fix that
      //Blizzard, why are your APIs so shit
      if (achievement.achievement.name.includes("Warlords")) {
        const uncompleteAchievementName = achievement.achievement.name;
        pvpAchievs.push(
          uncompleteAchievementName.substring(
            0,
            uncompleteAchievementName.indexOf("Season")
          ) +
            "of Draenor" +
            uncompleteAchievementName.substring(
              uncompleteAchievementName.indexOf("Season") - 1
            )
        );
      } else {
        pvpAchievs.push(achievement.achievement.name);
      }
    }
  });
  return { pvpAchievs: pvpAchievs, doneOnThisChar: doneOnThisChar };
}

/**
 * Find the highest rank someone had per season
 * @param {Object} pvpAchievs all the achievements
 * @param {Object} seasons all the seasons
 * @returns A dictionary object with key as season and value as rank
 */
function findHighestPVPAchievBySeason(
  pvpAchievs,
  seasonsPerExpansions,
  doneOnThisChar
) {
  let pvpRanking = {
    Combatant: 0,
    Challenger: 1,
    Rival: 2,
    Duelist: 3,
    Elite: 4,
    Gladiator: 5,
  };
  let counter = Object.keys(pvpRanking).length;
  Object.values(seasonsPerExpansions).map((seasons, i) => {
    Object.values(seasons).map((season, j) => {
      const seasonName = Object.keys(season)[0];
      let highestRank = -1;
      pvpAchievs.map((achievement, k) => {
        if (achievement.includes(seasonName)) {
          const correctRank = returnCorrectRankSubstring(achievement);
          if (
            typeof pvpRanking[correctRank] === "undefined" &&
            correctRank.includes("Gladiator")
          ) {
            pvpRanking[correctRank] = counter;
            counter = counter + 1;
          }
          if (highestRank < pvpRanking[correctRank]) {
            highestRank = pvpRanking[correctRank];
          }
        }
      });
      if (highestRank !== -1) {
        season[seasonName] = Object.keys(pvpRanking)[highestRank];
        season["doneOnThisChar"] = doneOnThisChar[i];
      }
    });
  });
  return seasonsPerExpansions;
}

/**
 * Get the correct Title, figure out if the title is a Rank: X type, Rank: X II type, or Gladiator type (you can have Shadowlands: Rival, Shadowlands: Rival II or Shadowlands: Sinful Gladiator)
 * @param {string} achievementRank The achievement that will be analyzed
 * @returns The rank of the achievement without the season
 */
function returnCorrectRankSubstring(achievement) {
  const rankWithNumber = achievement.substring(0, achievement.indexOf(" "));
  const rankWithoutNumber = achievement.substring(0, achievement.indexOf(":"));
  return achievement.includes("Gladiator")
    ? rankWithoutNumber
    : rankWithoutNumber.length > rankWithNumber.length
    ? rankWithNumber
    : rankWithoutNumber;
}

/**
 * Based on the PVP achievement title, figure out the expansion it belongs to
 * @param {string} str  The PVP achievement title
 * @returns The expansion it belongs to
 */
function getExpansionFromString(str) {
  return str.substring(0, str.indexOf("Season") - 1);
}

/**
 * Find every season the player received a rank
 * @param {Object} pvpAchievs all the achievements the player has
 * @returns An array with all the seasons the player had a rank
 */
function findEveryPVPSeason(pvpAchievs) {
  let seasons = [];
  let season = "";
  pvpAchievs.map((achievement, i) => {
    season = achievement.substring(achievement.indexOf(":") + 2);
    if (!seasons.includes(season)) seasons.push(season);
  });
  return seasons.sort(function (comparator, compared) {
    return sortPVPSeasons(comparator, compared);
  });
}

/**
 * Sort PVP seasons by expansion and then by season
 * @param {string} comparator String of the PVP achievement title we will compare to
 * @param {string} compared String of the PVP achievement title that will be compared
 * @returns An int value equivalent to their sorting order
 */
function sortPVPSeasons(comparator, compared) {
  const allSeasons = Helper.getAllSeasons();
  const substringValueComparator = getExpansionFromString(comparator);
  const substringValueCompared = getExpansionFromString(compared);
  return (
    allSeasons[substringValueCompared] - allSeasons[substringValueComparator] ||
    compared.substring(compared.length - 1, compared.length) -
      comparator.substring(comparator.length - 1, comparator.length)
  );
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
  return mythicKills > 0 ? 4 : heroicKills > 0 ? 3 : normalKills > 0 ? 2 : 1;
}

/**
 * Parses each tier to get the relevant information into a dictionary that will fit the table component
 * @param {Object} tier Dictionary holding the information regarding this tier
 * @param {string} metric The metric to be used (HPS or DPS)
 * @returns New custom made dictionary with the information put in a covenient form
 */
function parseWowlogsDataTiers(tier, metric) {
  let returnDictionary = [];
  console.log(tier)
  const overallMetric = tier["overall".concat(metric)];
  const ilvlMetric = tier["overall".concat(metric)];
  console.log(overallMetric.rankings)
  Object.entries(overallMetric.rankings).map((entry, i) => {
    returnDictionary.push({
      boss: entry[1].encounter.name,
      overall: entry[1].rankPercent
        ? Math.round(entry[1].rankPercent) + "%"
        : "-",
      ilvl: ilvlMetric.rankings[i].rankPercent
        ? Math.round(ilvlMetric.rankings[i].rankPercent) + "%"
        : "-",
      dps: ilvlMetric.rankings[i].rankPercent
        ? Math.round(entry[1].bestAmount).toLocaleString("en-US")
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
