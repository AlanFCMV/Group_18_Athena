import React, { useState } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './GlobalSearchPage.css';
import HelpGlobal from '../components/HelpGlobal';

const GlobalSearchPage = () =>
{
    // constructor(props)
    // {
    //     super(props);

    //     this.state = {

    //     }
    // }


    // const viewQuiz = async event => {
    //     event.preventDefault();

    //     window.location.href="./ViewQuiz";
    // };

    // delete later and use above
    const viewQuiz = async event => {
        event.preventDefault();

        alert("View this quiz!");
    };


    // const viewUser = async event => {
    //     event.preventDefault();

    //     window.location.href="./ViewUser";
    // };

    // delete later and use above
    const viewUser = async event => {
        event.preventDefault();

        alert("View this user!");
    };
    

    // 0: View Quizzes
    // 1: View Users
    const [quizorusers, setQuizorusers] = useState(0);

    const [searchQuizzesLiked, setSearchQuizzesLiked] = useState(0);
    const [searchQuizzesFollowing, setSearchQuizzesFollowing] = useState(0);
    const [searchUsersFollowing, setSearchUsersFollowing] = useState(0);

    var initialQuizzes = [
        {title:"a", user: "creator name"},
        {title:"b", user: "creator name"},
        {title:"c", user: "creator name"},
        {title:"a", user: "creator name"},
        {title:"b", user: "creator name"},
        {title:"c", user: "creator name"},
        {title:"a", user: "creator name"},
        {title:"b", user: "creator name"},
        {title:"c", user: "creator name"},
        {title:"a", user: "creator name"},
        {title:"b", user: "creator name"},
        {title:"c", user: "creator name"},
        {title:"a", user: "creator name"},
        {title:"b", user: "creator name"},
        {title:"c", user: "creator name"},
        {title:"a", user: "creator name"},
        {title:"b", user: "creator name"},
        {title:"c", user: "creator name"},
    ]

    var [quizzes, setQuizzes] = useState(initialQuizzes);

    const renderQuizzes = (quiz, index) =>
    {
        return (
            <tr className="userQuizRow" key={index}>
                <div className="userQuiz">
                    <button className="userquizButton" onClick={viewQuiz}>{quiz.title}</button><br />
                    <button className="quizcreatorButton" onClick={viewUser}>By {quiz.user}</button>
                </div>
            </tr>
        )
    }

    var initialUsers = [
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
        {name: "creator name"},
    ]

    var [users, setUsers] = useState(initialUsers);

    const renderUsers = (user, index) =>
    {
        return (
            <tr className="userRow" key={index}>
                <div className="user">
                    <button className="userButton" onClick={viewUser}>{user.name}</button>
                </div>
            </tr>
        )
    }


    if (quizorusers === 0)
        return (
            <div>
                <div className="container-fluid vh-100">
                    <div className="row">
                        <div className="col-3 column1 vh-100">

                            <form className="search-bar-form">
                                <input type="text" className="search-bar" placeholder="Search Quiz By Title"/>
                                <a className="search-button" ><img className="clickable-icon search-icon" alt="Search" src={require("../img/search.png")}/></a>
                            </form>

                            <div className="search-criteria-div">
                                <h3 className="search-criteria"> Search Criteria</h3>
                                <a className="criteria-question-button" ><img className="criteria-question-icon" alt="Search Questions" src={require("../img/quizfull.png")}/></a>
                                <a className="criteria-user-button" onClick={() => setQuizorusers(1)}><img className="clickable-icon criteria-user-icon" alt="Search Users" src={require("../img/userempty.png")}/></a>
                            </div>

                            <div className="search-filters-div">
                                <h3 className="search-filters"> Search Filters</h3>
                                <a className="filter-like-button" onClick={() => setSearchQuizzesLiked(1 - searchQuizzesLiked)}><img className="clickable-icon filter-like-icon" alt="Search Liked Quizzes" src={searchQuizzesLiked ? require("../img/addlikefull.png") : require("../img/addlikeempty.png")}/></a>
                                <a className="filter-add-user-button" onClick={() => setSearchQuizzesFollowing(1 - searchQuizzesFollowing)}><img className="clickable-icon filter-add-user-icon" alt="Search By Users You're Following" src={searchQuizzesFollowing ? require("../img/adduserfull.png") : require("../img/adduserempty.png")}/></a>
                            </div>

                            

                            <Popup trigger={
                                <a className="help">
                                    <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                                </a>
                            } position="top right">
                                <HelpGlobal quizorusers={quizorusers}/>
                            </Popup>
                        </div>

                        <div className="col-6 column2 vh-100">
                            <div className="view-global-quizzes">
                                <table className="view-global-quizzes-table">
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
    else
        return (
            <div>
                <div className="container-fluid vh-100">
                    <div className="row">
                        <div className="col-3 column1 vh-100">

                            <form className="search-bar-form">
                                <input type="text" className="search-bar" placeholder="Search Quiz By Title"/>
                                <a className="search-button" ><img className="clickable-icon search-icon" alt="Search" src={require("../img/search.png")}/></a>
                            </form>

                            <div className="search-criteria-div">
                                <h3 className="search-criteria"> Search Criteria</h3>
                                <a className="criteria-question-button" onClick={() => setQuizorusers(0)}><img className="clickable-icon criteria-question-icon" alt="Search Questions" src={require("../img/quizempty.png")}/></a>
                                <a className="criteria-user-button"><img className="criteria-user-icon" alt="Search Users" src={require("../img/userfull.png")}/></a>
                            </div>

                            <div className="search-filters-div">
                                <h3 className="search-filters"> Search Filter</h3>
                                <a className="filter-add-user-button" onClick={() => setSearchUsersFollowing(1 - searchUsersFollowing)}><img className="clickable-icon filter-add-user-icon" alt="Search By Users You're Following" src={searchUsersFollowing ? require("../img/adduserfull.png") : require("../img/adduserempty.png")}/></a>
                            </div>

                            <Popup trigger={
                                <a className="help">
                                    <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                                </a>
                            } position="top right">
                                <HelpGlobal quizorusers={quizorusers}/>
                            </Popup>
                        </div>

                        <div className="col-6 column2 vh-100">
                            <div className="view-global-quizzes">
                                <table className="view-global-quizzes-table">
                                    <tbody>
                                        {users.map(renderUsers)}
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

export default GlobalSearchPage;