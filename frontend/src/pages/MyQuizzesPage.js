import React, { useState } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './MyQuizzesPage.css';
import HelpViewQuiz from '../components/HelpViewQuiz';

const MyQuizzesPage = () =>
{
    const appName = 'athena18'
    function buildPath(route) 
    {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + appName + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

   
    var find = "";
    
    const search = async event => {
        event.preventDefault();
        //console.log(find)
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data.UserId, Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetuseralpha'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        console.log(res);
    }

    
    
    //const viewQuiz = async event => {
    //    event.preventDefault();
    //    

         //window.location.href="./ViewQuiz";
     //};

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
                            <input type="text" className="search-bar" id= "searchBar" placeholder="Search Quiz By Title" ref={(c) => find = c}/>
                            <a className="search-button" ><img className="clickable-icon search-icon" onClick={search} alt="Search" src={require("../img/search.png")}/></a>
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