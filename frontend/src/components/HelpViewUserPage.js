import React from 'react';
import './HelpNewQuiz.css';

function HelpViewUserPage()
{
    

    return (
        <div className="help-newquiz">
            <h3>View The Quizzes Of Another User</h3>
            <p><img className="help-like-icon small-icon" alt="Edit" src={require("../img/addlikeempty.png")}/> only view quizzes you've liked</p>
            <p><img className="help-delete-icon small-icon" alt="Delete" src={require("../img/adduserempty.png")}/> follow/unfollow the user</p>
        </div>
    );
    
}

export default HelpViewUserPage;