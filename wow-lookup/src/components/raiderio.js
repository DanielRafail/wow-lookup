import '../CSS/main.css';
import React, { useState } from 'react';
import "../CSS/main.css";
import Navigation from "../components/navigation.js"
import { useParams } from 'react-router-dom';


const Raiderio = () => {
    let params = useParams();
    //use params.url

    return (
        <div className="raiderio-main">
            <p>raiderio</p>
        </div>
    );
}

export default Raiderio;