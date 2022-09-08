import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import LinkTab from './linktab.js';



class Navigation extends React.Component {


    handleChange(event, v) {
        this.props.set_navigation_tab_value(v);
    }
    render() {
        return (

            <nav id="navigation-header">
                <Paper>
                    <Tabs
                        TabIndicatorProps={{
                            style: {
                                animation: "none"
                            }
                        }
                        }
                        value={this.props.navigation_tab_value}
                        onChange={(e, v) => this.handleChange(e, v)}
                        centered
                    >
                        <LinkTab changetab={this.props.navigation_tab_value} label="WoWlogs" value={0} />
                        <LinkTab changetab={this.props.navigation_tab_value} label="Raider.IO" value={1} />
                        <LinkTab changetab={this.props.navigation_tab_value} label="CheckPVP" value={2} />
                    </Tabs>
                </Paper>
            </nav>

        );
    }
}

export default Navigation;
