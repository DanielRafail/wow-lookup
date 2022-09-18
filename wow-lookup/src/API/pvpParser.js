import "../CSS/main.css";
import React from "react";
import Helper from "../Helper/helper.js";

/**
 * The Parser class which will take the input from the blizzard API and convert them into usable dictionaries for pvp purposes
 */
class PvpParser extends React.Component {

    /**
     * Parses the data of PVP into usable dictionaries
     * @param {Object} pvpData The data dictionary we get from the blizzard PVP APIs
     * @returns A usable dictionary
     */
    static parsePVPData(pvpData) {
        const pvpAchievs = getAllPVPAchievs(pvpData.data.achievements.achievements);
        const pvpSeasons = findEveryPVPSeason(pvpAchievs.pvpAchievs);
        const seasonsPerExpansions = divideSeasonsPerExpansion(pvpSeasons);
        findHighestPVPAchievBySeason(
            pvpAchievs.pvpAchievs,
            seasonsPerExpansions,
            pvpAchievs.doneOnThisChar
        );
        const twoRating = getRating(pvpData.data.two);
        const threeRating = getRating(pvpData.data.three);
        return {
            rankHistory: seasonsPerExpansions,
            twoRating: twoRating,
            threeRating: threeRating,
        };
    }


}
export default PvpParser;

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
        return null;
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
        rating: bracket.rating,
        seasonStats: bracket.season_match_statistics,
        weeklyStats: bracket.weekly_match_statistics,
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
    allAchievs.map((achievement, i) => {
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
        return null;
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
            let highestRank = 0;
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
                return null;
            });
            season[seasonName] = Object.keys(pvpRanking)[highestRank];
            season["doneOnThisChar"] = doneOnThisChar[i];
            return null;
        });
        return null;
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
        return null;
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