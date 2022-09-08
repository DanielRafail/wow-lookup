import '../CSS/main.css';
import SendIcon from '@mui/icons-material/Send';
import React, { useState } from 'react';
import "../CSS/main.css";
import IconButton from '@mui/material/IconButton';
import {useNavigate} from 'react-router-dom';




const Index = () => {
    let [url] = useState({url: ""});
    let navigate = useNavigate();

    function UpdateInput(event){
        url = event.target.value;
    }

    function HandleSubmit(event){
         navigate(`/lookup/${url}`);
   }
    
    return (
            <div className="main">
                <div className="body">
                    <h2 className="header-title">Paste the player's Raider.io URL</h2>
                    <form id="lookup-form">
                        <input type="text" id="io_url" name="io_url" placeholder="https://raider.io/characters/region/server/name" onChange={(e)=>UpdateInput(e)} />
                        <IconButton style={{transform: 'scale(1.8)', color:'white'}} onClick={(e)=>HandleSubmit(e)} >                                
                            <SendIcon/>
                        </IconButton>
                    </form>
                </div>
            </div>
        );
}

export default Index;

