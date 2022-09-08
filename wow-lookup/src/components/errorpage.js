import '../CSS/main.css';
import React, { useState } from 'react';
import "../CSS/main.css";
import Navigation from "../components/navigation.js"
import { useParams } from 'react-router-dom';


const Errorpage = () => {
    let params = useParams();
    //use params.url

    return (
        <div className="errorpage-main">
            <p>error</p>
        </div>
    );
}

export default Errorpage;