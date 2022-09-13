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
    const mythicPlusAlternate = raiderIOData.data.mythic_plus_alternate_runs;
    const mythicPlusBest = raiderIOData.data.mythic_plus_best_runs;
    const mythicPlusRecent = raiderIOData.data.mythic_plus_recent_runs;
    const MythicPlusScore = raiderIOData.data.mythic_plus_scores_by_season;
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
    const characterData = wowlogsData.data.data.characterData;
    const lfr = parseWowlogsDataTiers(characterData.lfr);
    const normal = parseWowlogsDataTiers(characterData.normal);
    const heroic = parseWowlogsDataTiers(characterData.heroic);
    const mythic = parseWowlogsDataTiers(characterData.mythic);
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
    const pvpSeasons = findEveryPVPSeason(pvpAchievs);
    const seasonsPerExpansions = divideSeasonsPerExpansion(pvpSeasons);
    findHighestPVPAchievBySeason(pvpAchievs, seasonsPerExpansions);
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
 * Create a dictionary object with keys for every expansion, and empty values
 * @param {*} seasons
 * @returns
 */
function divideSeasonsPerExpansion(seasons) {
  let currentSeason = "";
  let dividedSeasons = {};
  seasons.map((season, i) => {
    const nextSeasonEntry = getExpansionFromString(season);
    if (nextSeasonEntry !== currentSeason) {
      currentSeason = nextSeasonEntry;
      dividedSeasons[nextSeasonEntry] = [];
    }
    dividedSeasons[currentSeason].push({ [season]: "" });
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
  const pvpAchievsRegex = new RegExp("Season [0-9]$");
  allAchievs.achievements.data.achievements.map((achievement, i) => {
    if (pvpAchievsRegex.test(achievement.achievement.name)) {
      pvpAchievs.push(achievement.achievement.name);
    }
  });
  return pvpAchievs;
}

/**
 * Find the highest rank someone had per season
 * @param {Object} pvpAchievs all the achievements
 * @param {Object} seasons all the seasons
 * @returns A dictionary object with key as season and value as rank
 */
function findHighestPVPAchievBySeason(pvpAchievs, seasonsPerExpansions) {
  let pvpRanking = {
    Combatant: 0,
    Challenger: 1,
    Rival: 2,
    Duelist: 3,
    Elite: 4,
    Gladiator: 5,
  };
  Object.values(seasonsPerExpansions).map((seasons, i) => {
    Object.values(seasons).map((season, j) => {
      const seasonName = Object.keys(season)[0];
      let highestRank = -1;
      pvpAchievs.map((achievement, j) => {
        if (achievement.includes(seasonName)) {
          const rankWithNumber = achievement.substring(
            0,
            achievement.indexOf(" ")
          );
          const rankWithoutNumber = achievement.substring(
            0,
            achievement.indexOf(":")
          );
          const correctRank =
            rankWithoutNumber.length > rankWithNumber.length
              ? rankWithNumber
              : rankWithoutNumber;
          if (highestRank < pvpRanking[correctRank]) {
            highestRank = pvpRanking[correctRank];
          }
        }
      });
      if (highestRank !== -1)
        season[seasonName] = Object.entries(pvpRanking)[highestRank][0];
    });
  });
  return seasonsPerExpansions;
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
  console.log(comparator, compared);
  const allSeasons = getAllSeasons();
  const substringValueComparator = getExpansionFromString(comparator);
  const substringValueCompared = getExpansionFromString(compared);
  return (
    allSeasons[substringValueCompared] - allSeasons[substringValueComparator] ||
    compared.substring(compared.length - 1, compared.length) -
      comparator.substring(comparator.length - 1, comparator.length)
  );
}

/**
 * Hard code method which returns a dictionary with key all of WoW's expansions and values an incrementing ID. Have to manually hard code it because Blizzard API returns it in a falsy order. Maybe use other API call and compare based on ID?
 * @returns Dictionary object with keys = WoW expansions and values = incrementing ID
 */
function getAllSeasons() {
  let everySeasons = [
    "Classic",
    "Burning Crusade",
    "Wrath of the Lich King",
    "Cataclysm",
    "Mists of Pandaria",
    "Warlords of Draenor",
    "Legion",
    "Battle for Azeroth",
    "Shadowlands",
    "Dragonflight",
  ];
  let everySeasonsWithId = {};
  everySeasons.map((everySeason, i) => {
    everySeasonsWithId[everySeason] = i;
  });
  return everySeasonsWithId;
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
  return mythicKills > 0 ? 3 : heroicKills > 0 ? 2 : normalKills > 0 ? 1 : 0;
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
      overall: entry[1].rankPercent
        ? Math.round(entry[1].rankPercent) + "%"
        : "-",
      ilvl: tier.ilvl.rankings[i].rankPercent
        ? Math.round(tier.ilvl.rankings[i].rankPercent) + "%"
        : "-",
      dps: tier.ilvl.rankings[i].rankPercent
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
