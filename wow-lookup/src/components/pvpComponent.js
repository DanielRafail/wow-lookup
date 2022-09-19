import "../CSS/main.css";
import React from "react";
import CustomTable from "./table";
import Accordion from "./accordion.js";
import Challenger from "../images/Challenger.png";
import Combatant from "../images/Combatant.png";
import Rival from "../images/Rival.png";
import Duelist from "../images/Duelist.png";
import Gladiator from "../images/Gladiator.png";
import Elite from "../images/Elite.png";

const pvpComponent = (props) => {
  const parsedData = props.data.parsedPVPData;
  const images = {
    Challenger: { Challenger },
    Combatant: { Combatant },
    Rival: { Rival },
    Duelist: { Duelist },
    Gladiator: { Gladiator },
    Elite: { Elite },
  };

  /**
   * Return the React component for the rows of the 2v2 and 3v3 pvp brackets
   * @returns React component for the rows of the 2v2 and 3v3 pvp brackets
   */
  function returnRowsForBrackets() {
    const two = {
      bracket: "2v2",
      rating: parsedData.twoRating.rating
        ? parsedData.twoRating.rating.toString()
        : "0",
      weekly:
        "Played: " +
        (parsedData.twoRating.weeklyStats
          ? parsedData.twoRating.weeklyStats.played.toString()
          : "0") +
        " Won: " +
        (parsedData.twoRating.weeklyStats
          ? parsedData.twoRating.weeklyStats.won.toString()
          : "0") +
        " Lost: " +
        (parsedData.twoRating.weeklyStats
          ? parsedData.twoRating.weeklyStats.lost.toString()
          : "0"),
      weeklyRatio:
        parsedData.twoRating.weeklyStats &&
        parsedData.twoRating.weeklyStats.won &&
        parsedData.twoRating.weeklyStats.lost
          ? (
              parsedData.twoRating.weeklyStats.won /
              parsedData.twoRating.weeklyStats.lost
            )
              .toFixed(2)
              .toString()
              .concat("%")
          : "-",
      season:
        "Played: " +
        (parsedData.twoRating.seasonStats
          ? parsedData.twoRating.seasonStats.played.toString()
          : "0") +
        " Won: " +
        (parsedData.twoRating.seasonStats
          ? parsedData.twoRating.seasonStats.won.toString()
          : "0") +
        " Lost: " +
        (parsedData.twoRating.seasonStats
          ? parsedData.twoRating.seasonStats.lost.toString()
          : "0"),
      seasonRatio:
        parsedData.twoRating.seasonStats &&
        parsedData.twoRating.seasonStats.won &&
        parsedData.twoRating.seasonStats.lost
          ? (
              parsedData.twoRating.seasonStats.won /
              parsedData.twoRating.seasonStats.lost
            )
              .toFixed(2)
              .concat("%")
          : "-",
    };
    const three = {
      bracket: "3v3",
      rating: parsedData.threeRating.rating
        ? parsedData.threeRating.rating.toString()
        : "0",
      weekly:
        "Played: " +
        (parsedData.threeRating.weeklyStats
          ? parsedData.threeRating.weeklyStats.played.toString()
          : "0") +
        " Won: " +
        (parsedData.threeRating.weeklyStats
          ? parsedData.threeRating.weeklyStats.won.toString()
          : "0") +
        " Lost: " +
        (parsedData.threeRating.weeklyStats
          ? parsedData.threeRating.weeklyStats.lost.toString()
          : "0"),
      weeklyRatio:
        parsedData.threeRating.weeklyStats &&
        parsedData.threeRating.weeklyStats.won &&
        parsedData.threeRating.weeklyStats.lost
          ? (
              parsedData.threeRating.weeklyStats.won /
              parsedData.threeRating.weeklyStats.lost
            )
              .toFixed(2)
              .toString()
              .concat("%")
          : "-",
      season:
        "Played: " +
        (parsedData.threeRating.seasonStats
          ? parsedData.threeRating.seasonStats.played.toString()
          : "0") +
        " Won: " +
        (parsedData.threeRating.seasonStats
          ? parsedData.threeRating.seasonStats.won.toString()
          : "0") +
        " Lost: " +
        (parsedData.threeRating.seasonStats
          ? parsedData.threeRating.seasonStats.lost.toString()
          : "0"),
      seasonRatio:
        parsedData.threeRating.seasonStats &&
        parsedData.threeRating.seasonStats.won &&
        parsedData.threeRating.seasonStats.lost
          ? (
              parsedData.threeRating.seasonStats.won /
              parsedData.threeRating.seasonStats.lost
            )
              .toFixed(2)
              .toString()
              .concat("%")
          : "-",
    };
    return [two, three];
  }

  /**
   * Set the accordions' content for each distinctive seasons in pvp
   * @param {Object} seasonArray Array with all the seasons
   * @returns React element containing the accordion's content
   */
  function setSeasonsAccordionContent(seasonArray) {
    return (
      <div>
        {seasonArray.map((season, i) => {
          return (
            <div className="pvpRankInfoContainer" key={i}>
              {
                <img
                  src={
                    images[Object.values(season)[0]]
                      ? Object.values(images[Object.values(season)[0]])[0]
                      : Gladiator
                  }
                  alt="PVP Rank"
                  className="rankIcons"
                />
              }
              {season.doneOnThisChar ? (
                <p className="pvpText">
                  {Object.keys(season)[0]} : {Object.values(season)[0]}
                  <span className="pvp-achiev-desc">
                    Completed on this character
                  </span>
                </p>
              ) : (
                <p className="pvpText">
                  {Object.keys(season)[0]} : {Object.values(season)[0]}
                  <span className="pvp-achiev-desc">
                    Completed on another character
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /**
   * Set the title for the accordion dividing each pvp seasons
   * @param {int} index int representing the season we are on
   * @returns the key (name) of the season
   */
  function setSeasonsAccordionTitles(index) {
    return Object.keys(parsedData.rankHistory)[index];
  }

  /**
   * Return the all the pvp content for the pvpComponent
   * @returns all the pvp content for the pvpComponent
   */
  function returnPVPComponent() {
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
        {Object.values(parsedData.rankHistory).map((entryDictionary, i) => {
          return (
            <Accordion
              content={[setSeasonsAccordionContent(entryDictionary)]}
              titles={[setSeasonsAccordionTitles(i)]}
              expanded={true}
              key={i}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="pvp-section">
      {parsedData && parsedData.rankHistory ? (
        returnPVPComponent()
      ) : props.data && props.data.pvpError && props.data.pvpError !== 404 ? (
        <p className="error-p">Error loading PVP info</p>
      ) : props.data && props.data.pvpError && props.data.pvpError ? (
        <p>This Player has no PVP experience</p>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default pvpComponent;
