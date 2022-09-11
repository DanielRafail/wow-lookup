import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import CustomTable from "./table";
import Helper from "../Helper/helper.js";
import Accordion from "./accordion.js";

/**
 * Summary page which will show information about your WoWlogs, Raider.IO and CheckPVP in one compact location
 * @returns HTML and logic components for the Summary page
 */
class Summary extends React.Component {
  
  returnRaiderIOBestKeys() {
    const headers = ["Dungeons", "Fortified", "Tyrannical"];
    return (
      <div className="best-keys">
        <h4>
          {this.props.data.name} -{" "}
          {Helper.capitalizeFirstLetter(this.props.data.server)} (
          {this.props.data.raiderio.score.all} IO)
        </h4>
        <h6>
          DPS({this.props.data.raiderio.score.dps} IO), Healer(
          {this.props.data.raiderio.score.healer} IO), Tank(
          {this.props.data.raiderio.score.tank} IO)
        </h6>
        <CustomTable headers={headers} rows={this.props.data.raiderio.keys} />
      </div>
    );
  }

  returnRaiderIOContent() {
    return (
      <div className="raiderIO-section">
        {this.props.data.raiderio ? (
          this.returnRaiderIOBestKeys()
        ) : this.props.data.raiderIOError ? (
          <p className="error-p">Error loading Raider.IO info</p>
        ) : (
          <React.Fragment />
        )}
        <div className="flex-seperator"></div>
        {this.props.data.raiderio.recentRuns &&
        this.props.data.raiderio.keys ? (
          <div className="recent-keys">
            <h4>Most Recent Runs</h4>
            <h6 className="hidden">.</h6>
            <CustomTable
              headers={["Dungeons", "Date"]}
              rows={this.props.data.raiderio.recentRuns}
            />
          </div>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="summary-main">
        <Accordion
          content={[this.returnRaiderIOContent()]}
          titles={["RaiderIO", "Wowlogs", "PVP"]}
        />
      </div>
    );
  }
}

export default Summary;
