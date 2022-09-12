import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React from "react";
import CustomTable from "./table";

const RaiderioComponent = (props) => {
  /**
   * Function which returns the best keys you have run this season
   * @returns The best keys you have run this season
   */
  function returnRaiderIOBestKeys() {
    const headers = ["Dungeons", "Fortified", "Tyrannical"];
    return (
      <div className="best-keys">
        <h4>
          {props.data.name} - {Helper.capitalizeFirstLetter(props.data.server)}{" "}
          ({props.data.parsedRaiderIOData.score.all} IO)
        </h4>
        <h6>
          DPS({props.data.parsedRaiderIOData.score.dps} IO), Healer(
          {props.data.parsedRaiderIOData.score.healer} IO), Tank(
          {props.data.parsedRaiderIOData.score.tank} IO)
        </h6>
        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.keys}
        />
      </div>
    );
  }

  /**
   * Function which returns the most recent keys you have run this season (number of keys equivalent to the number of dungeons this season)
   * @returns The most recents keys you have run this season
   */
  function returnRaiderIORecentKeys() {
    return (
      <div className="recent-keys">
        <h4>Most Recent Runs</h4>
        <h6 className="hidden">.</h6>
        <CustomTable
          headers={["Dungeons", "Date"]}
          rows={props.data.parsedRaiderIOData.recentRuns}
        />
      </div>
    );
  }

  return (
    <div className="raiderIO-section">
      {props.data &&
      props.data.parsedRaiderIOData &&
      props.data.parsedRaiderIOData.keys ? (
        returnRaiderIOBestKeys()
      ) : props.data && props.data.raiderIOError ? (
        <p className="error-p">Error loading Raider.IO info</p>
      ) : (
        <React.Fragment />
      )}
      <div className="flex-seperator"></div>
      {props.data &&
      props.data.parsedRaiderIOData &&
      props.data.parsedRaiderIOData.recentRuns &&
      props.data.parsedRaiderIOData.keys ? (
        returnRaiderIORecentKeys()
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default RaiderioComponent;
