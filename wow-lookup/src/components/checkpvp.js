import '../CSS/main.css';
import React, { useState } from 'react';
import "../CSS/main.css";
import Navigation from "../components/navigation.js"
import { useParams } from 'react-router-dom';


const Checkpvp = () => {
    let params = useParams();
    //use params.url

    return (
        <div className="checkpvp-main">
            <p>wowlogs</p>
        </div>
    );
}

export default Checkpvp;