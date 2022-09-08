import '../CSS/main.css';
import SendIcon from '@mui/icons-material/Send';
import React, { useEffect } from 'react';
import "../CSS/main.css";
import IconButton from '@mui/material/IconButton';
import {useNavigate} from 'react-router-dom';




const Index = () => {
    // this.updateInput = this.updateInput.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);

    /* useEffect = () => {
        const navigate = useNavigate();
    } */

    function UpdateInput(event){
        //this.setState({url : event.target.value})
        console.log(event.target.value);
    }

    function HandleSubmit(event){
        let navigate = useNavigate();
        navigate("/lookup.js");
   }
    
    return (
            <div className="main">
                <div className="body">
                    <h2 className="header-title">Paste the player's Raider.io URL</h2>
                    <form id="lookup-form">
                        <input type="text" id="io_url" name="io_url" placeholder="https://raider.io/characters/region/server/name" /* onChange={this.updateInput} *//>
                        <IconButton style={{transform: 'scale(1.8)', color:'white'}} onClick={HandleSubmit()} >                                
                            <SendIcon/>
                        </IconButton>
                    </form>
                </div>
            </div>
        );
}

export default Index;

