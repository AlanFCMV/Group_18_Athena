import React, { useState } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './MyQuizzesPage.css';
import HelpViewQuiz from '../components/HelpViewQuiz';
import { set } from 'mongoose';

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
    var initialQuizzes = []
    
    const search = async event => {
        event.preventDefault();
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data.UserId, Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetuserdate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        setQuizzes(res);
    }

    const viewQuiz = async (name) => {
        localStorage.setItem('quizID',JSON.stringify(name));
        window.location.href ="/ViewUserQuiz";
        
    };

    const cardSaver = async(name) => {
        localStorage.setItem('quizID',JSON.stringify(name));
        window.location.href = "/EditQuiz";

    }

    const doDelete = async (quizID) => {
        if(window.confirm("Are you sure you want to delete this set?")){
            var obj = {_id:quizID}
            var js = JSON.stringify(obj);

            var userInfo = localStorage.getItem('user');
            var blah = JSON.parse(userInfo);

            try{
                const response = await fetch(buildPath('api/deleteset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
                var res = JSON.parse(await response.text());

                if(res.error){
                    document.getElementById('addError').innerHTML = res.error;
                }
                else
                    window.location.href="./Myquizzes";
            }
            catch(e){
                return;
            }
        }
    }

   async function firstSearch(){
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data.UserId, Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetuserdate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        setQuizzes(res);

        obj = {UserId:data.UserId, Search:""};
        js = JSON.stringify(obj);
        const followersResponse = await fetch(buildPath('api/searchuserfollowersalpha'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var followersRes = JSON.parse(await followersResponse.text());
        console.log(followersRes);
        document.getElementById("follower-count").innerHTML = "Followers: " + (followersRes.length).toString();

        document.getElementById("user-count").innerHTML = data.Username;
   }

   window.onload = function(){firstSearch()};

    var [quizzes, setQuizzes] = useState(initialQuizzes);
    

    const renderQuizzes = (quiz, index) =>
    {  
        return (
            <tr className="myQuizRow" key={index}>
                    <div className="myQuiz">
                        <button className="quizButton" onClick={() => viewQuiz(quiz._id)}>{quiz.Name}</button> 
                    </div> 
                    <a className="otherButtons" ><img className="clickable-icon edit-icon"   onClick={()=> cardSaver(quiz._id)} src={require("../img/edit.png")}/></a>
                    <a className="otherButtons" ><img className="clickable-icon delete-icon"  onClick={() => doDelete(quiz._id)} src={require("../img/delete.png")}/></a>
            </tr>
        )
    }

    return (
        <div>
            <div className="container-fluid vh-100">
                <div className="row">
                    <div className="col-3 column1 vh-100">
                      
                        <form className="search-bar-form">
                            <input type="text" className="search-bar" id= "searchBar" onKeyUp={search} placeholder="Search Quiz By Title" ref={(c) => find = c}/>
                            <a className="search-button" ><img className="clickable-icon search-icon"  alt="Search"  src={require("../img/search.png")}/></a>
                        </form>
                        
                        <div className="user-count-div">
                            <h3 id='user-count'>EnterNameHere</h3>
                        </div>

                        <div className="follower-count-div">
                            <h3 className="follower-count" id="follower-count">Followers: 0</h3>
                            <p id='addError'></p>
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
                            <table id="quizTable" className="view-my-quizzes-table">
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