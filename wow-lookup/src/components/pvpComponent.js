import "../CSS/main.css";
import React from "react";
import CustomTable from "./table";
import Accordion from "./accordion.js";


const pvpComponent = (props) => {
  const parsedData = props.data.parsedPVPData;

  function returnRowsForBrackets() {
    const two = {
      bracket: "2v2",
      rating: parsedData.twoRating.rating.toString(),
      weekly:
        "Played: " +
        parsedData.twoRating.weeklyStats.played.toString() +
        " Won: " +
        parsedData.twoRating.weeklyStats.won.toString() +
        " Lost: " +
        parsedData.twoRating.weeklyStats.lost.toString(),
      weeklyRatio: (
        parsedData.twoRating.weeklyStats.won /
        parsedData.twoRating.weeklyStats.lost
      ).toFixed(2).concat("%"),
      season:
        "Played: " +
        parsedData.twoRating.seasonStats.played.toString() +
        " Won: " +
        parsedData.twoRating.seasonStats.won.toString() +
        " Lost: " +
        parsedData.twoRating.seasonStats.lost.toString(),
      seasonRatio: (
        parsedData.twoRating.seasonStats.won /
        parsedData.twoRating.seasonStats.lost
      ).toFixed(2).concat("%"),
    };
    const three = {
      bracket: "3v3",
      rating: parsedData.threeRating.rating.toString(),
      weekly:
        "Played: " +
        parsedData.threeRating.weeklyStats.played.toString() +
        " Won: " +
        parsedData.threeRating.weeklyStats.won.toString() +
        " Lost: " +
        parsedData.threeRating.weeklyStats.lost.toString(),
      weeklyRatio: (
        parsedData.threeRating.weeklyStats.won /
        parsedData.threeRating.weeklyStats.lost
      ).toFixed(2).toString().concat("%"),

      season:
        "Played: " +
        parsedData.threeRating.seasonStats.played.toString() +
        " Won: " +
        parsedData.threeRating.seasonStats.won.toString() +
        " Lost: " +
        parsedData.threeRating.seasonStats.lost.toString(),
      seasonRatio: (
        parsedData.threeRating.seasonStats.won /
        parsedData.threeRating.seasonStats.lost
      ).toFixed(2).toString().concat("%"),
    };
    return [two, three];
  }

  function setSeasonsAccordionContent(seasonArray) {
    return <div>
      {seasonArray.map((season, i) => {
        return <p key={i}>{/* PLACE IMAGE HERE, HAVE FUNCTION FIGURE OUT CORRECT IMAGE*/}{Object.keys(season)[0]} : {Object.values(season)[0]}</p>
      }
      )}
    </div>
  }

  function setSeasonsAccordionTitles(index) {
    return Object.keys(parsedData.rankHistory)[index];
  }

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
          return <Accordion
            content={[setSeasonsAccordionContent(entryDictionary)]}
            titles={[setSeasonsAccordionTitles(i)]}
            expanded={true}
            key={i}
          />
        }
        )
        }
      </div>
    );
  }

  return (
    <div className="pvp-section">
      {parsedData &&
        parsedData.rankHistory &&
        parsedData.twoRating &&
        parsedData.twoRating.rating ? (
        returnPVPComponent()
      ) : props.data && props.data.pvpError ? (
        <p className="error-p">Error loading PVP info</p>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default pvpComponent;