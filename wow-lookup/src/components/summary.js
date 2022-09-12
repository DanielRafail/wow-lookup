import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import Accordion from "./accordion.js";
import RaiderioComponent from "./raiderioComponent.js";
import WowlogsComponent from "./wowlogsComponent.js";

/**
 * Summary page which will show information about your WoWlogs, Raider.IO and CheckPVP in one compact location
 * @returns HTML and logic components for the Summary page
 */
const Summary = (props) => {
  return (
    <div className="summary-main">
      <Accordion
        content={[
          <RaiderioComponent
            data={{
              name: props.url.split("&")[2],
              server: props.url.split("&")[1],
              parsedRaiderIOData: props.data.parsedRaiderIOData,
              raiderIOError: props.data.raiderIOError,
            }}
          />,
          // <WowlogsComponent
          //   data={{
          //     name: props.url.split("&")[2],
          //     server: props.url.split("&")[1],
          //     parsedWowlogsData: props.data.parsedWowlogsData,
          //     wowlogsError: props.data.wowlogsError,
          //   }}
          // />,
        ]}
        titles={["RaiderIO", "WarcraftLogs", "PVP"]}
      />
    </div>
  );
};

export default Summary;
