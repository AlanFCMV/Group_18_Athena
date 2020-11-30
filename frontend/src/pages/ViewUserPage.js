import React, { useState } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './ViewUserPage.css';
import HelpViewUserPage from '../components/HelpViewUserPage';

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
    async function search(){
        var userInfo = localStorage.getItem('quizCreator');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data, Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetuserdate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        setQuizzes(res);
       
    }

    async function firstSearch(){
        var userInfo = localStorage.getItem('quizCreator');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data, Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetuserdate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        setQuizzes(res);
        var newobj = {UserId:data};
        js = JSON.stringify(newobj);
        const response2 = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res2 = JSON.parse(await response2.text());
        document.getElementById('creatorName').innerHTML = res2.Username;
        
        updateFollowers();

        var initialFollowState = await isUserFollowing();
        if(initialFollowState === 1)
        {
            console.log("initializing follow button to be full");
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserfull.png");
        }
        else if (initialFollowState === 0)
        {
            console.log("initializing follow button to be empty");
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserempty.png");
        }
        else
        {
            document.getElementById("creatorName").innerHTML = "You (" + document.getElementById("creatorName").innerHTML + ")";
            document.getElementById("creatorNameDiv").className += " longer-creatorName";
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserempty.png");
            document.getElementById("follow-button-to-toggle").className += " invisisble"; 
        }
    }

    window.onload = function(){firstSearch()};
    const viewQuiz = async (name) => {
        localStorage.setItem('quizID',JSON.stringify(name));
        window.location.href ="/ViewGlobalQuiz";
    };

    const [searchQuizLiked, setSearchQuizLiked] = useState(0);

    var [quizzes, setQuizzes] = useState([]);


    async function updateFollowers()
    {
        var quizID = localStorage.getItem('quizCreator');
        var data = JSON.parse(quizID);
        var obj = {UserId:data};
        var js = JSON.stringify(obj);
        try{
            const response = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            document.getElementById('followCount').innerHTML = "Followers: " + res.Followers.length;
            console.log("FOLLOWERS: " + res.Followers.length);
        }
        catch(e){
            console.log("error in updateFollowers() " + e);
            return;
        }
    }


    async function isUserFollowing()
    {
        var isUserFollowing = 0;
        var globalUserInfo = localStorage.getItem('quizCreator');
        var data = JSON.parse(globalUserInfo);
        var obj = {UserId: data};
        var js = JSON.stringify(obj);
        
        var user = localStorage.getItem('user');
        var userdata = JSON.parse(user);
        var userobj = userdata.UserId;
        
        
        try{
            if (data === userobj)
            {
                return -1; // Creator and User are the same
            }
            
            const idResponse = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var idRes = JSON.parse(await idResponse.text());
            
            console.log("idRes: " + idRes)
            console.log("idRes.Followers: " + idRes.Followers)
            for (let i = 0; i < idRes.Followers.length; i++)
            {   
                if (idRes.Followers[i] === userobj)
                {
                    isUserFollowing = 1;
                    break;
                }
            }
        }
        catch(e){
            console.log(e);
            return;
        }

        console.log("isUserFollowing: " + isUserFollowing);
        return isUserFollowing;
    }

    async function followUser() {
        var globalUserInfo = localStorage.getItem('quizCreator');
        var data = JSON.parse(globalUserInfo);
        var obj = {UserId: data};
        var js = JSON.stringify(obj);

        var userInfo = localStorage.getItem('user');
        var blah = JSON.parse(userInfo);
        try{
            const response = await fetch(buildPath('api/follow'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
        }
        catch(e){
            console.log("e: " + e + " catch 2")
            return;
        }
        updateFollowers();
    }

    async function unFollowUser() {
        var globalUserInfo = localStorage.getItem('quizCreator');
        var data = JSON.parse(globalUserInfo);
        var obj = {UserId: data};
        var js = JSON.stringify(obj);

        var userInfo = localStorage.getItem('user');
        var blah = JSON.parse(userInfo);
        try{
            const response = await fetch(buildPath('api/unfollow'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
        }
        catch(e){
            console.log("e: " + e + " catch 2")
            return;
        }
        updateFollowers();
    }
    ///////////////////////////////////
    //         SearchBylikes         //
    ///////////////////////////////////
    async function searchByLikes(){
        var globalUserInfo = localStorage.getItem('quizCreator');
        var data = JSON.parse(globalUserInfo);
        var obj = {UserId: data, Search:find.value};
        var js = JSON.stringify(obj);

        var userInfo = localStorage.getItem('user');
        var blah = JSON.parse(userInfo);
        try{
            const response = await fetch(buildPath('api/searchsetuserlikeddate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
            setQuizzes(res);
        }
        catch(e){
            return;
        }
    }
    async function toggleFollowing()
    {
        var newFollowingState = await isUserFollowing();
        console.log("newFollowingState: " + newFollowingState)
        if (newFollowingState)
        {
            console.log("Getting ready to unfollow user");
            await unFollowUser();
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserempty.png");
        }
        else
        {
            await followUser();
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserfull.png");
        }
    }
    ///////////////////////////////////////////////////////////////
    //                       togglelikedquizzes                  //
    ///////////////////////////////////////////////////////////////
    async function toggleLiked(){
        var toggleL = document.getElementById("like-button-to-toggle").alt;
        //setSearchQuizzesLiked(1-searchQuizzesLiked);
 
        if(toggleL === "0"){
             document.getElementById("like-button-to-toggle").alt = "1";
             document.getElementById("like-button-to-toggle").src = require("../img/addlikefull.png");
        }
        else if(toggleL === "1"){
             document.getElementById("like-button-to-toggle").alt = "0";
             document.getElementById("like-button-to-toggle").src = require("../img/addlikeempty.png");
        }
        searchlikeduser();
    }      
    
    ///////////////////////////////////////////////////////////////
    //                       searchlikeduser                     //
    ///////////////////////////////////////////////////////////////
    async function searchlikeduser(){
        var toggleL = document.getElementById("like-button-to-toggle").alt;
        if(toggleL === "1"){
            searchByLikes();
        }
        else
            search();
    }
    const renderQuizzes = (quiz, index) =>
    {
        return (
            <tr className="myQuizRow" key={index}>
                <div className="myQuiz">
                    <button className="quizButton" onClick={() => viewQuiz(quiz._id)}>{quiz.Name}</button>
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
                            <input type="text" className="search-bar" onKeyUp={searchlikeduser} placeholder="Search Quiz By Title" ref={(c) => find = c}/>
                            <a className="search-button" ><img className="clickable-icon search-icon" alt="Search" src={require("../img/search.png")}/></a>
                        </form>

                        <div className="search-filters-div">
                            <h3 className="search-filters"> Search Filter</h3>
                            <a className="filter-like-button" onClick={toggleLiked}><img className="clickable-icon filter-like-icon" alt="0"id="like-button-to-toggle" src={require("../img/addlikeempty.png")}/></a>
                        </div>
                        
                        <div className="global-quiz-creator-div" id="creatorNameDiv">
                            <h3 className="global-quiz-creator"id="creatorName"></h3>
                        </div>

                        <div className="follow-user-button-div">
                            {/* This onClick function should also make an API call to add or remove the user from the following list */}
                            <a className="follow-user-button" onClick={toggleFollowing}><img className="clickable-icon follow-user-icon" alt="Follow User" id="follow-button-to-toggle" src={""}/></a>
                        </div>

                        <div className="global-user-follower-count-div">
                            <h3 className="follower-count"id="followCount"></h3>
                        </div>

                        
                        <Popup trigger={
                            <a className="help">
                                <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                            </a>
                        } position="top right">
                            <HelpViewUserPage />
                        </Popup>
                    </div>

                    <div className="col-6 column2 vh-100">
                        

                        <div className="view-user-quizzes">
                            <table className="view-user-quizzes-table">
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