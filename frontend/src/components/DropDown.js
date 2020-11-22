import React from 'react';
import './DropDown.css';

function DropDown()
{
    const goToNewQuiz = async event => {window.location.href="./NewQuiz";};
    const goToMyQuizzes = async event => {window.location.href="./MyQuizzes";};
    const goToGlobalSearch = async event => {window.location.href="./GlobalSearch";};




    return (
        <div className="menu">
            <ul className="dropdown-list">
                <li><button className="dropdown-items" onClick={goToNewQuiz}><span><img className="menu-image add" alt="NEW QUIZ" src={require("../img/addquiz.png")} /></span><b>NEW QUIZ</b></button></li>
                <li><button className="dropdown-items" onClick={goToMyQuizzes}><span><img className="menu-image book" alt="MY QUIZZES" src={require("../img/book.png")} /></span><b>MY QUIZZES</b></button></li>
                <li><button className="dropdown-items" onClick={goToGlobalSearch}><span><img className="menu-image globe" alt="GLOBAL SEARCH" src={require("../img/globe.png")} /></span><b>GLOBAL SEARCH</b></button></li>
            </ul>
        </div>
    );
    
}

export default DropDown;

