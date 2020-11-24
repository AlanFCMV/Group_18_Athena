import React, { useState } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './MyQuizzesPage.css';
import HelpViewQuiz from '../components/HelpViewQuiz';

const MyQuizzesPage = () =>
{
    // const viewQuiz = async event => {
    //     event.preventDefault();

    //     window.location.href="./ViewQuiz";
    // };

    // delete later and use above
    const viewQuiz = async event => {
        event.preventDefault();

        alert("View this quiz!");
    };

    var initialQuizzes = [
        {title:"a"},
        {title:"b"},
        {title:"c"},
        {title:"a"},
        {title:"b"},
        {title:"c"},
        {title:"a"},
        {title:"b"},
        {title:"c"},
        {title:"a"},
        {title:"b"},
        {title:"c"},
        {title:"a"},
        {title:"b"},
        {title:"c"},
        {title:"a"},
        {title:"b"},
        {title:"c"},
    ]

    var [quizzes, setQuizzes] = useState(initialQuizzes);

    const renderQuizzes = (quiz, index) =>
    {
        return (
            <tr className="myQuizRow" key={index}>
                <div className="myQuiz">
                    <button className="quizButton" onClick={viewQuiz}>{quiz.title}</button>
                </div>
            </tr>
        )
    }

    return (
        <div>
            <div className="container-fluid vh-100">
                <div className="row">
                    <div className="col-3 column1 vh-100">

                        <form className="search-bar-form">
                            <input type="text" className="search-bar" placeholder="Search Quiz By Title"/>
                            <a className="search-button" ><img className="clickable-icon search-icon" alt="Search" src={require("../img/search.png")}/></a>
                        </form>

                        <div className="follower-count-div">
                            <h3 className="follower-count">Followers: 0</h3>
                        </div>
                        
                        <Popup trigger={
                            <a className="help">
                                <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                            </a>
                        } position="top right">
                            <HelpViewQuiz />
                        </Popup>
                    </div>

                    <div className="col-6 column2 vh-100">
                        <div className="view-my-quizzes">
                            <table className="view-my-quizzes-table">
                                <tbody>
                                    {quizzes.map(renderQuizzes)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-3 column3 vh-100"></div>
                </div>
            </div>
            <Header />
        </div>

    );
};

export default MyQuizzesPage;