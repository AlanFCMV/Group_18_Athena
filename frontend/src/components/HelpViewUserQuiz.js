import React from 'react';
import './HelpNewQuiz.css';

function HelpViewUserQuiz()
{
    

    return (
        <div className="help-newquiz">
            <h3>Study The Quiz</h3>
            <p><img className="help-arrow-icon small-icon" alt="Edit" src={require("../img/arrow.png")}/> View different questions</p>
            <p><img className="help-mouse-icon small-icon" alt="Edit" src={require("../img/mouse.png")}/> Click the card to flip it</p>
            <p><img className="help-edit-icon small-icon" alt="Edit" src={require("../img/edit.png")}/> Edit The Quiz</p>
            <p><img className="help-delete-icon small-icon" alt="Delete" src={require("../img/delete.png")}/> Delete The Quiz</p>
        </div>
    );
    
}

export default HelpViewUserQuiz;