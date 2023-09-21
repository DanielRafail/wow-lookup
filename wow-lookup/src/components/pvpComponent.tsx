import "../CSS/main.css";
import React from "react";
import CustomTable from "./table";
import Accordion from "./accordion";
import Challenger from "../images/Challenger.png";
import Combatant from "../images/Combatant.png";
import Rival from "../images/Rival.png";
import Duelist from "../images/Duelist.png";
import Gladiator from "../images/Gladiator.png";
import Elite from "../images/Elite.png";
import {
  iParsedPVPData,
  PvPBrackets,
  PVPSeason,
  pvpRanks,
} from "../interfaces/lookup/interface";

interface Props {
  data: {
    parsedPVPData: iParsedPVPData;
    name: string;
    server: string;
  };
}

const pvpComponent = (props: Props) => {
  const parsedData = props.data.parsedPVPData;
  const images = {
    Challenger: Challenger,
    Combatant: Combatant,
    Rival: Rival,
    Duelist: Duelist,
    Gladiator: Gladiator,
    Elite: Elite,
    Legend: Gladiator,
  };

  /**
   * Return the React component for the rows of the 2v2, 3v3 and solo shuffle pvp brackets
   * @returns React component for the rows of the 2v2, 3v3 and solo shuffle pvp brackets
   */
  function returnRowsForBrackets() {
    var returnArray: PvPBrackets[] = [];
    for (const [key, bracket] of Object.entries(parsedData.brackets)) {
      const name =
        !key.includes("two") && !key.includes("three")
          ? "Solo Shuffle (" + key + ")"
          : !key.includes("three")
          ? "2v2"
          : "3v3";
      returnArray.push({
        bracket: name,
        rating: bracket && bracket.rating ? bracket.rating.toString() : "0",
        weekly:
          "Played: " +
          (bracket && bracket.weeklyStats
            ? bracket.weeklyStats.played.toString()
            : "0") +
          " | Won: " +
          (bracket && bracket.weeklyStats
            ? bracket.weeklyStats.won.toString()
            : "0") +
          " | Lost: " +
          (bracket && bracket.weeklyStats
            ? bracket.weeklyStats.lost.toString()
            : "0"),
        weeklyRatio:
          bracket &&
          bracket.weeklyStats &&
          bracket.weeklyStats.won &&
          bracket.weeklyStats.lost
            ? ((bracket.weeklyStats.won / bracket.weeklyStats.played) * 100)
                .toFixed(2)
                .concat("%")
            : "-",
        season:
          "Played: " +
          (bracket && bracket.seasonStats
            ? bracket.seasonStats.played.toString()
            : "0") +
          " | Won: " +
          (bracket && bracket.seasonStats
            ? bracket.seasonStats.won.toString()
            : "0") +
          " | Lost: " +
          (bracket && bracket.seasonStats
            ? bracket.seasonStats.lost.toString()
            : "0"),
        seasonRatio:
          bracket &&
          bracket.seasonStats &&
          bracket &&
          bracket.seasonStats.won &&
          bracket &&
          bracket.seasonStats.lost
            ? ((bracket.seasonStats.won / bracket.seasonStats.played) * 100)
                .toFixed(2)
                .concat("%")
            : "-",
      });
    }
    return returnArray.sort((first, second) =>
      first.bracket.localeCompare(second.bracket)
    );
  }

  /**
   * Order the seasons based on their chronogical order
   * @param {*} a first season
   * @param {*} b second season
   * @returns int representing their order
   */
  function compareSeasons(a: PVPSeason, b: PVPSeason) {
    const seasonA = parseInt(
      (a["name"] || "").match(/Season (\d+)/)?.[1] || "0",
      10
    );
    const seasonB = parseInt(
      (b["name"] || "").match(/Season (\d+)/)?.[1] || "0",
      10
    );
    return seasonB - seasonA;
  }

  /**
   * Set the accordions' content for each distinctive seasons in pvp
   * @param {Object} seasonArray Array with all the seasons
   * @returns React element containing the accordion's content
   */
  function setSeasonsAccordionContent(seasonArray: PVPSeason[]) {
    seasonArray.sort(compareSeasons);
    return (
      <div>
        {seasonArray.map((season, i) => {
          const title = season["name"];
          return (
            <div className="pvpRankInfoContainer" key={i}>
              {
                <img
                  src={
                    Object.keys(images).includes(
                      title.substring(title.indexOf(":") + 2)
                    )
                      ? images[
                          title.substring(title.indexOf(":") + 2) as pvpRanks
                        ]
                      : Gladiator
                  }
                  alt="PVP Rank"
                  className="rankIcons"
                />
              }
              <p className="pvpText">
                {season["name"]}
                <span className="pvp-achiev-desc">
                  {season["completed"]
                    ? "Completed on this character"
                    : "Completed on another character"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  /**
   * Return the all the pvp content for the pvpComponent
   * @returns all the pvp content for the pvpComponent
   */
  function returnPVPComponent() {
    const orderedTitles: string[] = [];
    const orderedRankHistory = Object.values(parsedData.rankHistory).sort(
      function (first, second) {
        return first.id - second.id;
      }
    );
    for (const id in orderedRankHistory) {
      for (const [key, value] of Object.entries(parsedData.rankHistory)) {
        if (parseInt(id) === parseInt(value.id)) orderedTitles.push(key);
      }
    }
    return (
      <div>
        <CustomTable
          headers={[
            "Bracket",
            "Rating",
            "Weekly Stats",
            "Weekly WLR",
            "Season Stats",
            "Season WLR",
          ]}
          rows={returnRowsForBrackets()}
        />
        {orderedRankHistory.map((rankHistory, i) => {
          return (
            <Accordion
              content={[setSeasonsAccordionContent(rankHistory.seasons)]}
              titles={[orderedTitles[i]]}
              key={rankHistory.id}
              defaultExpanded={true}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="pvp-section">
      {parsedData && parsedData.rankHistory && returnPVPComponent()}
    </div>
  );
};

export default pvpComponent;
