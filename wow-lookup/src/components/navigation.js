import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import LinkTab from "./LinkTab"
import theme from "../styling/theme";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import history from "../history"



class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation_tab_value: 0
        }
    }

    componentDidMount(props) {
        this.setState({ navigation_tab_value: this.verifyTabIndex() })
    }

    verifyTabIndex = () => {
        var tab_index = 0;
        if (history.location && history.location.state) {
            tab_index = history.location.state.tabIndex;
        } else {
            if (history.location) {
                switch (history.location.pathname) {
                    case "/introduction":
                        tab_index = 0;
                        break;
                    case "/experience":
                        tab_index = 1;
                        break;
                    case "/personality":
                        tab_index = 2;
                        break;
                    default:
                        break;
                }
            }
        }
        return tab_index;
    }


    handleChange = (event, newValue) => {
        this.setState(() => ({ navigation_tab_value: this.state.location && this.state.location.tabIndex ? this.state.location.tabIndex : newValue }));
    }
    render() {
        return (
            <MuiThemeProvider theme={createMuiTheme(theme)}>
                <nav id="navigation-header">
                    <Paper>
                        <Tabs
                            TabIndicatorProps={{
                                style: {
                                    animation: "none"
                                }
                            }
                            }
                            value={this.state.navigation_tab_value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <LinkTab label="Introduction" href="/introduction" tabIndex={0} />
                            <LinkTab label="Experience" href="/experience" tabIndex={1} />
                            <LinkTab label="Personality" href="/personality" tabIndex={2} />
                        </Tabs>
                    </Paper>
                </nav>
            </MuiThemeProvider>
        );
    }
}

export default withRouter(Navigation);
