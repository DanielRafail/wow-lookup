import React from 'react';
import Tab from '@mui/material/Tab';

/**
 * Single Tab elements with the general className and ...this.props to handle all props elements
 */
class LinkTab extends React.Component {
    
    render() {
        return (
            
            <Tab
                disableRipple={true}
                className="nav_tab"
                {...this.props}
            />
        );
    }
}


export default LinkTab;