import React from 'react';
import './HelpNewQuiz.css';

function HelpEditQuiz()
{
    

    return (
        <div className="help-newquiz">
            <h3>Edit A Quiz Here</h3>
            <p>All valid quizzes must have a title and at least 1 question and answer.</p>
            <p><img className="help-add-icon small-icon" alt="Add" src={require("../img/add.png")}/> add a question</p>
            <p><img className="help-remove-icon small-icon" alt="Remove" src={require("../img/remove.png")}/> remove a question</p>
            <p><img className="help-save-icon small-icon" alt="Save" src={require("../img/save.png")}/> save your quiz</p>
            
        </div>
    );
    
}

export default HelpEditQuiz;