import "../CSS/main.css";
import React, { useState, useEffect } from 'react';
import "../CSS/main.css";
import Accordion from "./accordion.js";
import RaiderioComponent from "./raiderioComponent.js";
import WowlogsComponent from "./wowlogsComponent.js";
import PVPComponent from "./pvpComponent.js";
import CircularProgress from "@mui/material/CircularProgress";


/**
 * Summary page which will show information about your WoWlogs, Raider.IO and PVP in one compact location
 * @returns HTML and logic components for the Summary page
 */
const Summary = (props) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowText(true);
    }, 6000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="summary-main">
      <Accordion
        content={[
          props.data.parsedRaiderIOData ? (
            <RaiderioComponent
              data={{
                name: props.url.split("&")[2],
                server: props.url.split("&")[1],
                parsedRaiderIOData: props.data.parsedRaiderIOData,
              }}
            />
          ) : (
            <div className="circular-progress-summary">
              <CircularProgress size={100} />
              {showText && <p className="error-p">Error loading RaiderIO info</p>}
            </div>
          ),
          props.data.parsedWowlogsData ? (
            <WowlogsComponent
              data={{
                name: props.url.split("&")[2],
                server: props.url.split("&")[1],
                parsedWowlogsData: props.data.parsedWowlogsData,
              }}
            />
          ) : (
            <div className="circular-progress-summary">
              <CircularProgress size={100} />
              {showText && <p className="error-p">Error loading WarcraftLogs info</p>}
            </div>
          ),
          props.data.parsedPVPData ? (
            <PVPComponent
              data={{
                name: props.url.split("&")[2],
                server: props.url.split("&")[1],
                parsedPVPData: props.data.parsedPVPData,
              }}
            />
          ) : (
            <div className="circular-progress-summary">
              <CircularProgress size={100} />
              {showText && <p className="error-p">Error loading PVP info</p>}
            </div>
          ),
        ]}
        titles={["RaiderIO", "WarcraftLogs", "PVP"]}
        defaultExpanded={false}
      />
    </div>
  );
};

export default Summary;
