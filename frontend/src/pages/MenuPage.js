import React from 'react';
import Header from '../components/Header';
import '../pages/MenuPage.css';

const MenuPage = () =>
{

    return(
        <div>
            <h1 className="menupage-welcomemessage">Welcome To Athena:<br />Wisdom In Your Pocket</h1>
            <div className="row menupage-buttons">
                <div className="col-4 menu-col">
                    <div className="menu-item">
                         <a href="./NewQuiz">
                            <img className="menu-icon" alt="Dropdown Menu" src={require("../img/addquiz.png")}/>
                        </a>
                        <h2 className="menubuttons-text">NEW QUIZ</h2>
                    </div>
                </div>
                <div className="col-4 menu-col">
                    <div className="menu-item">
                         <a href="./MyQuizzes">
                            <img className="menu-icon" alt="Dropdown Menu" src={require("../img/book.png")}/>
                        </a>
                        <h2 className="menubuttons-text">MY QUIZZES</h2>
                    </div>
                </div>
                <div className="col-4 menu-col">
                    <div className="menu-item">
                         <a href="./GlobalSearch">
                            <img className="menu-icon" alt="Dropdown Menu" src={require("../img/globe.png")}/>
                        </a>
                        <h2 className="menubuttons-text">GLOBAL SEARCH</h2>
                    </div>
                </div>
            </div>
            <Header />
        </div>
        

    );
};

export default MenuPage;