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
        //   return <Accordion
        //   content={[Object.values(entryDictionary)]}
        //   titles={["RaiderIO", "WarcraftLogs", "PVP"]}
        //   expanded = {true}
        // />
        //Im thinking to change the value of rankHistory so it fits into the accordion since this is the only place where we use it
        console.log(Object.values(entryDictionary).map((a,b) =>{console.log(a)}))
          return Object.values(entryDictionary).map((entry, j) => {
            return <p key={j}>
            {Object.entries(entry)[0][0]} : {Object.entries(entry)[0][1]}
          </p>
          })
        })}
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
