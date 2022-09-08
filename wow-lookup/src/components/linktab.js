import React from 'react';
import Tab from '@mui/material/Tab';

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