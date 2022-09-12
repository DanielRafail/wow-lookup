import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "./table";

const WowlogsComponent = (props) => {
  let [difficulty, setDifficulty] = useState(0);

  /**
   * Function ran whenever the props element is modified which verifies what the current difficulty is (Based on page reload and tabs click)
   */
  const choseCorrectDifficulty = useCallback((props) => {
    console.log(props, "@@@");
    if (
      props.data.parsedWowlogsData.mainParseDifficulty &&
      props.data.parsedWowlogsData &&
      props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.lfr
    ) {
      switch (props.data.parsedWowlogsData.mainParseDifficulty) {
        case 0:
          setDifficulty(props.data.parsedWowlogsData.tableData.lfr);
          return null;
        case 1:
          setDifficulty(props.data.parsedWowlogsData.tableData.normal);
          return null;
        case 2:
          setDifficulty(props.data.parsedWowlogsData.tableData.heroic);
          return null;
        case 3:
          setDifficulty(props.data.parsedWowlogsData.tableData.mythic);
          return null;
        default:
          return null;
      }
    } else return null;
  }, []);

  useEffect(() => {
    choseCorrectDifficulty();
  }, [choseCorrectDifficulty]);

  /**
   * Function which goes through all the parses of your chosen difficulty and displays your average parses between all bosses
   * @returns The average parses between all bosses
   */
  function findAverageParse() {
    let averageParse = 0;
    difficulty.map((boss, i) => {
      averageParse = averageParse + boss.overall;
    });
    return averageParse / difficulty.length;
  }

  /**
   * Returns the main logic components of the wowlogs section. Seperated for tidiness 
   * @returns the main logic components of the wowlogs section
   */
  function returnWowlogsContent() {
    console.log(difficulty);
    return (
      <div className="wowlogs-section">
        <div className="wowlogs-section-data">
          {props.data.name} - {Helper.capitalizeFirstLetter(props.data.server)}{" "}
          ({props.data.parsedWowlogsData.mainSpec} Main Spec)
          <h6>{findAverageParse()} Average Parse</h6>
          <CustomTable
            headers={[
              "Boss",
              "Overall Parse",
              "Ilvl Parse",
              "Highest DPS",
              "Kill Count",
            ]}
            rows={difficulty}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="wowlogs-section">
      {props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.lfr ? (
        returnWowlogsContent()
      ) : props.data && props.data.wowlogsError ? (
        <p className="error-p">Error loading Raider.IO info</p>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default WowlogsComponent;
