import '../CSS/main.css';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';


class Index extends React.Component{

    render(){

        return (
                <div className="main">
                    <header className="header">
                        <h2>Paste the player's Raider.io URL</h2>
                        <form action="/" id="lookup-form">
                            <input type="text" id="io_url" name="io_url"  placeholder="https://raider.io/characters/region/server/name"/>
                            <input type="image" src="" alt="Submit Form"/>
                        </form>
                    </header>
                </div>
        );
    }
}

export default Index;

