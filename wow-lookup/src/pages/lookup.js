import '../CSS/main.css';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';
import "../CSS/main.css";
import IconButton from '@mui/material/IconButton';
import { Navigate } from "react-router-dom";

class Lookup extends React.Component{ 
    
    render(){    
    return (
            <div className="main">
                <p>Hello {this.props.url}</p>
            </div>
        );
    }
}

export default Lookup;