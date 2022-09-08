import '../CSS/main.css';
import React, { useState } from 'react';
import "../CSS/main.css";
import Navigation from "../components/navigation.js"
import {useParams} from 'react-router-dom';
import Wowlogs from "../components/wowlogs.js"
import Raiderio from "../components/raiderio.js"
import Checkpvp from "../components/checkpvp.js"
import Errorpage from "../components/errorpage.js"


const Lookup = () =>{ 
    let [navigation_tab_value, set_navigation_tab_value] = useState(0);
    let params = useParams();
    //use params.url

    function choseCorrectPage(){
        const display = navigation_tab_value == 0 ? <Wowlogs/> : navigation_tab_value == 1 ? <Raiderio/> : navigation_tab_value == 2 ? <Checkpvp/> : <Errorpage/>
        return display;
    }

    return (
            <div className="main">
                <Navigation navigation_tab_value={navigation_tab_value} set_navigation_tab_value={set_navigation_tab_value}/>
                <div className="body">
                </div>
            </div>
        );
}

export default Lookup;