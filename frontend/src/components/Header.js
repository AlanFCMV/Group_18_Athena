import React, { useState } from 'react';
import Popup from "reactjs-popup";
import './Header.css';
import DropDown from './DropDown';

function Header() {
    
    return (
        <div className="Header">

            <ul className="navbar-list">
                <li className="navbar-item">
                    <Popup trigger={
                        <a className="navbar-dropdown">
                            <img className="navbar-dropdown-icon" alt="Dropdown Menu" src={require("../img/bars.png")}/>
                        </a>   
                    }>
                        <DropDown />
                    </Popup>
                </li>
                <li className="navbar-item">
                    <a href="./Menu" className="navbar-compass">
                        <img className="navbar-compass-icon" alt="Return to Main Menu" src={require("../img/compass.png")}/>
                    </a>
                </li>
                <li className="navbar-item">
                    <a href="./" className="navbar-logout">
                        <img className="navbar-logout-icon" alt="Logout Button" src={require("../img/logout.png")}/>
                    </a>
                </li>
                <li className="navbar-item navbar-item-title"><img className="navbar-title" alt="ATHENA" src={require("../img/AthenaTextLogo.png")}/></li>
            </ul> 
        </div>
    );
    
}

export default Header;