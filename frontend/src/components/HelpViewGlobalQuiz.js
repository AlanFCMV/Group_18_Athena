import React from 'react';
import './HelpNewQuiz.css';

function HelpViewGlobalQuiz()
{
    

    return (
        <div className="help-newquiz">
            <h3>Study The Quiz</h3>
            <p><img className="help-arrow-icon small-icon" alt="Edit" src={require("../img/arrow.png")}/> View different questions</p>
            <p><img className="help-mouse-icon small-icon" alt="Edit" src={require("../img/mouse.png")}/> Click the card to flip it</p>
            <p><img className="help-like-icon small-icon" alt="Edit" src={require("../img/addlikeempty.png")}/> Like/Unlike The Quiz</p>
            <p><img className="help-delete-icon small-icon" alt="Delete" src={require("../img/adduserempty.png")}/> Follow/Unfollow The Creator</p>
        </div>
    );
    
}

export default HelpViewGlobalQuiz;