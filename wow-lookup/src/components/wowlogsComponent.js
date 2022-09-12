import "../CSS/main.css";
import Helper from "../Helper/helper.js";
import React from "react";
import CustomTable from "./table";

const WowlogsComponent = (props) => {
  function choseCorrectDifficulty() {
    if (
      props.data.parsedWowlogsData.mainParseDifficulty &&
      props.data.parsedWowlogsData &&
      props.data.parsedWowlogsData.tableData &&
      props.data.parsedWowlogsData.tableData.lfr
    ) {
      switch (props.data.parsedWowlogsData.mainParseDifficulty) {
        case 0:
          return props.data.parsedWowlogsData.tableData.lfr;
        case 1:
          return props.data.parsedWowlogsData.tableData.normal;
        case 2:
          return props.data.parsedWowlogsData.tableData.heroic;
        case 3:
          return props.data.parsedWowlogsData.tableData.mythic;
        default:
          return null;
      }
    } else return null;
  }

  function returnWowlogsContent() {
    return (
      <div className="wowlogs-section">
        {props.data.parsedWowlogsData ? (
          <div className="wowlogs-section-data">
            {props.data.name} -{" "}
            {Helper.capitalizeFirstLetter(props.data.server)} (
            {props.data.parsedWowlogsData.mainSpec} IO)
            {
              <CustomTable
                headers={[
                  "Boss",
                  "Overall Parse",
                  "Ilvl Parse",
                  "Highest DPS",
                  "Kill Count",
                ]}
                rows={choseCorrectDifficulty()}
              />
            }
          </div>
        ) : props.data.wowlogsError ? (
          <p className="error-p">Error loading WowLogs info</p>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }

  return (
    <div className="wowlogs-section">
      {props.data &&
      props.data.parsedWowlogsData &&
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
