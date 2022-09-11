import "../CSS/main.css";
import React from "react";
import "../CSS/main.css";
import CustomTable from "./table";
import Helper from "../Helper/helper.js"

/**
 * Summary page which will show information about your WoWlogs, Raider.IO and CheckPVP in one compact location
 * @returns HTML and logic components for the Summary page
 */
class Summary extends React.Component {
  render() {
    return (
      <div className="summary-main">
        {this.props.data.raiderio ? (
          <div>
             <h4>{this.props.data.name} - {Helper.capitalizeFirstLetter(this.props.data.server)} ({this.props.data.raiderio.score.all} IO)</h4>
              <h6>DPS({this.props.data.raiderio.score.dps} IO), Healer({this.props.data.raiderio.score.healer} IO), Tank({this.props.data.raiderio.score.tank} IO)</h6>
            <CustomTable
              headers={["Dungeons", "Fortified", "Tyrannical"]}
              rows={this.props.data.raiderio.keys}
            />
            <h4>Most Recent Runs:</h4>
          </div>
        ) : (
          <React.Fragment />
        )}
        {this.props.data.raiderIOError ? (
          <p className="error-p">Error loading Raider.IO info</p>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

export default Summary;
