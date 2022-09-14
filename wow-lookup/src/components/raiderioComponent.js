import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React from "react";
import CustomTable from "./table";

const RaiderioComponent = (props) => {
  /**
   * Function which returns the best keys you have run this season
   * @returns The best keys you have run this season
   */
  function returnRaiderIOBestKeys(headers) {
    return (
      <div className="best-keys">
        <h4 style={{marginBottom:"0px"}}>
          {props.data.name} - {Helper.capitalizeFirstLetter(props.data.server)}{" "}
          ({props.data.parsedRaiderIOData.score.all} IO)
        </h4>
        <h6 style={{marginTop:"20px"}}>
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
   * Verify if props are valid
   * @returns If props are valid
   */
  function verifyProps(){
    return props.data &&
    props.data.parsedRaiderIOData &&
    props.data.parsedRaiderIOData.keys &&
    props.data.parsedRaiderIOData.keys.length !== 0
  }

  /**
   * Function which returns the most recent keys you have run this season (number of keys equivalent to the number of dungeons this season)
   * @returns The most recents keys you have run this season
   */
  function returnRaiderIORecentKeys(headers) {
    return (
      <div className="recent-keys">
        <h6 className="hidden">.</h6>
        <h4>Most Recent Runs</h4>
        <CustomTable
          headers={headers}
          rows={props.data.parsedRaiderIOData.recentRuns}
        />
      </div>
    );
  }
  function createEmptyTableArray(allDungeons){
    let returnArray = [];
    allDungeons.map((dungeon, i) =>{
      returnArray.push({dungeon: dungeon.name, tyrannical: "-", fortified:"-"})
    })
    return returnArray;
  }
  return (
    <div className="raiderIO-section">
      {verifyProps() ? (
        returnRaiderIOBestKeys(["Dungeons", "Fortified", "Tyrannical"])
      ) : props.data && props.data.raiderIOError ? (
        <p className="error-p">Error loading Raider.IO info</p>
      ) : (
        <CustomTable
          headers={["Dungeons", "Fortified", "Tyrannical"]}
          rows={createEmptyTableArray(props.data.parsedRaiderIOData.allDungeons)}
        />
      )}
      <div className="flex-seperator"></div>
      {verifyProps() ? (
        returnRaiderIORecentKeys(["Dungeons", "Keys", "Date"])
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};



export default RaiderioComponent;


