import React from 'react';
import './HelpNewQuiz.css';

function HelpGlobal(props)
{
    if (props.quizorusers)
        return (
            <div className="help-newquiz">
                <h3>View Global Users Here</h3>
                <p><img className="small-icon" alt="View Quizzes" src={require("../img/quizempty.png")}/> view global quizzes</p>
                <p><img className="small-icon" alt="View Followees" src={require("../img/adduserempty.png")}/> only view users you follow</p>
            </div>
        );   
    else
        return (
            <div className="help-newquiz">
                <h3>View Global Quizzes Here</h3>
                <p><img className="small-icon" alt="View Users" src={require("../img/userempty.png")}/> view global users</p>
                <p><img className="small-icon" alt="View Liked Quizzes" src={require("../img/addlikeempty.png")}/> only view quizzes you've liked</p>
                <p><img className="small-icon" alt="View Followees' Quizzes" src={require("../img/adduserempty.png")}/> only view quizzes made by users you follow</p>
            </div>
        );  
}

export default HelpGlobal;