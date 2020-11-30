import React, { useState, Components, useEffect, useRef, useCallback } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './GlobalSearchPage.css';
import HelpGlobal from '../components/HelpGlobal';

const GlobalSearchPage = () =>
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
    var find ="";

    async function search() {
        var obj = {Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetglobaldate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}}); 
        var res = JSON.parse(await response.text());

       
        var newQuizzesState = [];

        for (let i = 0; i < res.length; i++)
        {
            var data = res[i].Creator
            obj = {UserId:data};
            js = JSON.stringify(obj);
   
            try {
                const idResponse = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var idRes = JSON.parse(await idResponse.text());
                newQuizzesState.push({Name:res[i].Name, Creator:idRes.Username, Id:res[i]._id, userID:idRes._id});
            }

            catch(e) {
                return;
            }
        }

    
        setQuizzes(newQuizzesState);
    }
    //////////////////////////////////////////////////////////////////////
    //                          USER SEARCH                             //
    //////////////////////////////////////////////////////////////////////
    async function userSearch(){
        var userstate = [];

        var obj2={Search:find.value};
        var js2 = JSON.stringify(obj2);
        const response2 = await fetch(buildPath('api/searchuserglobalalpha'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
        var res2 = JSON.parse(await response2.text());
        for(var i = 0; i < res2.length; i++){
            
            try{
                const response3 = await fetch(buildPath('api/searchuserglobalalpha'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
                var res3 = JSON.parse(await response3.text());
                
                userstate.push({UserName:res3[i].Username, id:res3[i]._id})
            }
            catch(e){
                return
            }
        }
        setUsers(userstate);
    }
    //////////////////////////////////////////////////////////////////////
    //                          FIRST SEARCH                            //
    //////////////////////////////////////////////////////////////////////
    async function firstSearch(){
    
        var obj = {Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetglobaldate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}}); 
        var res = JSON.parse(await response.text());
    
        var userstate = [];

        var obj2={Search:find.value};
        var js2 = JSON.stringify(obj2);
        const response2 = await fetch(buildPath('api/searchuserglobalalpha'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
        var res2 = JSON.parse(await response2.text());
        for(var i = 0; i < res2.length; i++){
            
            try{
                const response3 = await fetch(buildPath('api/searchuserglobalalpha'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
                var res3 = JSON.parse(await response3.text());
                userstate.push({UserName:res3[i].Username, id:res3[i]._id})
            }
            catch(e){
                return
            }
        }
        setUsers(userstate);
        
        var newQuizzesState = [];

        for (let i = 0; i < res.length; i++)
        {
            var data = res[i].Creator
            obj = {UserId:data};
            js = JSON.stringify(obj);
   
            try {
                const idResponse = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var idRes = JSON.parse(await idResponse.text());
                newQuizzesState.push({Name:res[i].Name, Creator:idRes.Username, Id:res[i]._id, userID:idRes._id});
            }
            catch(e) {
                return;
            }
        }
        setQuizzes(newQuizzesState);
    }

    window.onload = function(){firstSearch()};


    // delete later and use above
    const viewQuiz = async event => {
        event.preventDefault();

        alert("View this quiz!");
    };

    // delete later and use above
    const viewUser = async event => {
        event.preventDefault();

        alert("View this user!");
    };
    

    // 0: View Quizzes
    // 1: View Users
    const [quizorusers, setQuizorusers] = useState(0);

    const [searchUsersFollowing, setSearchUsersFollowing] = useState(0);

    const cardSaver = async(name) => {
        localStorage.setItem('quizID',JSON.stringify(name));
        window.location.href = "/viewglobalquiz";
    }
    const userCardSaver = async(name) => {
        localStorage.setItem('quizCreator',JSON.stringify(name));
        window.location.href = "/viewuser";

    }

    //////////////////////////////////////////////////////////////////////
    //                          LIKED SEARCH                            //
    //////////////////////////////////////////////////////////////////////
    async function likedSearch(){
        
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data.UserId, Search:find.value};
        var js = JSON.stringify(obj);
       

        const response = await fetch(buildPath('api/searchsetlikeddate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        

        var searchLiked = [];
        
        
            for(var i=0; i < res.length; i++){
        
            var data = res[i].Creator;
            obj = {UserId:data};
            js = JSON.stringify(obj);
            try{
                const response2 = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var res2 = JSON.parse(await response2.text());
                searchLiked.push({Name:res[i].Name, Creator:res2.Username, Id:res[i]._id, userID:res2._id});
            }
            catch(e){
                return;
            }
            }
            setQuizzes(searchLiked);
    }

    //////////////////////////////////////////////////////////////////////
    //                          FOLLOWING SEARCH                        //
    //////////////////////////////////////////////////////////////////////
    async function followingSearch(){
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data.UserId, Search:find.value};
        var js = JSON.stringify(obj);

        const response = await fetch(buildPath('api/searchsetfollowingdate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());

        var  followingSearch= [];
        
        for(var i=0; i < res.length; i++){
        
            var data = res[i].Creator;
            obj = {UserId:data};
            js = JSON.stringify(obj);
            try{
                const response2 = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var res2 = JSON.parse(await response2.text());
                followingSearch.push({Name:res[i].Name, Creator:res2.Username, Id:res[i]._id, userID:res2._id});
                
            }
            catch(e){
                return;
            }
        }
        setQuizzes(followingSearch);
    }
    const useStateWithPromise = (initialState) => {
        const [state, setState] = useState(initialState);
        const resolverRef = useRef(null);
      
        useEffect(() => {
          if (resolverRef.current) {
            resolverRef.current(state);
            resolverRef.current = null;
          }
        }, [resolverRef.current, state]);
      
        const handleSetState = useCallback((stateAction) => {
          setState(stateAction);
          return new Promise(resolve => {
            resolverRef.current = resolve;
          });
        }, [setState])
      
        return [state, handleSetState];
      };
    //////////////////////////////////////////////////////////////////////
    //                         LIKED AND FOLLOWING SEARCH               //
    //////////////////////////////////////////////////////////////////////
    async function likeAndFollowSearch(){
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj = {UserId:data.UserId, Search:find.value};
        var js = JSON.stringify(obj);
        
        const response = await fetch(buildPath('api/searchsetfollowingandlikeddate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
        var res = JSON.parse(await response.text());
        var likeAndFollowing = [];

        for(var i = 0; i < res.length; i++){
            var data = res[i].Creator;
            var obj2 = {UserId:data};
            js = JSON.stringify(obj2);
            
            try{
                const response2 = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var res2 = JSON.parse(await response2.text());
                likeAndFollowing.push({Name:res[i].Name, Creator:res2.Username, Id:res[i]._id, userID:res2._id});
            }
            catch(e){
                return
            }
            setQuizzes(likeAndFollowing);
        }
    }
    //////////////////////////////////////////////////////////////////////
    //                         SEARCHFOLLOWINGUSERS                     //
    //////////////////////////////////////////////////////////////////////
    async function searchFollowedUsers(){
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(userInfo);
        var obj2 = {UserId:data.UserId, Search:find.value};
        var js2 = JSON.stringify(obj2);

        const response4 = await fetch(buildPath('api/searchuserfollowingalpha'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
        var res5 = JSON.parse(await response4.text());
        console.log(res5)

        var searchFollowed = [];

        for(var i=0; i < res5.length; i++){
            console.log("inside for loop")
            var data2 = res5[i].Username;
            console.log(data2)
            var obj3 = {UserId:data2};
            var js5 = JSON.stringify(obj3);
            console.log(js5)
            searchFollowed.push({UserName:res5[i].Username, id:res5[i]._id});
                
        }
        setUsers(searchFollowed);
    }
    //////////////////////////////////////////////////////////////////////
    //                    TOGGLEFOLLOWINGUSERS                          //
    //////////////////////////////////////////////////////////////////////
    async function toggleFollowUsers(){
        var toggleU = document.getElementById("Search By Users You're Following").alt;

        if(toggleU === "0"){
            document.getElementById("Search By Users You're Following").alt = "1";
            document.getElementById("Search By Users You're Following").src = require("../img/adduserfull.png");
        }
        else if(toggleU === "1"){
            document.getElementById("Search By Users You're Following").alt = "0";
            document.getElementById("Search By Users You're Following").src = require("../img/adduserempty.png");
        }

        userFollowSearch();
    }
    //////////////////////////////////////////////////////////////////////
    //                    USERFOLLOWSEARCH                              //
    //////////////////////////////////////////////////////////////////////
    async function userFollowSearch(){
        var toggleU = document.getElementById("Search By Users You're Following").alt;
        if(toggleU === "1"){
            searchFollowedUsers();
        }
        else
            userSearch();
    }

    //////////////////////////////////////////////////////////////////////
    //                         TOGGLELIKE                               //
    //////////////////////////////////////////////////////////////////////
    async function toggleLike(){
        
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
      
       await toSearch();
    }
    //////////////////////////////////////////////////////////////////////
    //                         TOGGLEFOLLOWING                          //
    //////////////////////////////////////////////////////////////////////
    async function toggleFollowers(){
       var toggleF = document.getElementById("follow-button-to-toggle").alt;

       if(toggleF === "0"){
            document.getElementById("follow-button-to-toggle").alt = "1";
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserfull.png");
       }
       else if(toggleF === "1"){
            document.getElementById("follow-button-to-toggle").alt = "0";
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserempty.png");
       }
      
    toSearch();
    }
    //////////////////////////////////////////////////////////////////////
    //                         TOSEARCH                                 //
    //////////////////////////////////////////////////////////////////////
    async function toSearch(){
        var toggleL = document.getElementById("like-button-to-toggle").alt; 
        var toggleF = document.getElementById("follow-button-to-toggle").alt;
        
        if((toggleF === "1") && (toggleL === "1")){
           await likeAndFollowSearch();
        }
        else if(toggleF === "1"){
            await followingSearch();
        }
        else if(toggleL === "1"){
           await likedSearch();
        }
        else
           await search();
           
    }

    var [quizzes, setQuizzes] = useStateWithPromise([]);
    
    var quizNumber = -1;
    const renderQuizzes = (quiz, index) =>
    {
        quizNumber++;
        //var idNumber = "quizUser-" + quizNumber.toString();
        if(quizNumber === quizzes.length){
            quizNumber = -1;
        }
        return (
            <tr className="userQuizRow" key={index}>
                <div className="userQuiz">
                    <button className="userquizButton" onClick={()=>cardSaver(quiz.Id)}>{quiz.Name}</button><br />
                    <button className="quizcreatorButton" id="quizUser" onClick={()=>userCardSaver(quiz.userID)}>Created by: {quiz.Creator}</button>
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
                    <button className="userButton"  onClick={()=>userCardSaver(user.id)}>{user.UserName}</button>
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
                                <input type="text" className="search-bar" onKeyUp={toSearch} placeholder="Search Quiz By Title" ref={(c) => find = c}/>
                                <a className="search-button" ><img className="clickable-icon search-icon" alt="Search" src={require("../img/search.png")}/></a>
                            </form>

                            <div className="search-criteria-div">
                                <h3 className="search-criteria"> Search Criteria</h3>
                                <a className="criteria-question-button" ><img className="criteria-question-icon" alt="Search Questions" src={require("../img/quizfull.png")}/></a>
                                <a className="criteria-user-button" onClick={() => setQuizorusers(1)}><img className="clickable-icon criteria-user-icon" alt="Search Users" src={require("../img/userempty.png")}/></a>
                            </div>

                            <div className="search-filters-div">
                                <h3 className="search-filters"> Search Filters</h3>
                                <a className="filter-like-button" onClick={toggleLike}><img className="clickable-icon filter-like-icon" alt="0" id="like-button-to-toggle" src={require("../img/addlikeempty.png")}/></a>
                                <a className="filter-add-user-button" onClick={toggleFollowers}><img className="clickable-icon filter-add-user-icon" alt="0" id="follow-button-to-toggle"src={require("../img/adduserempty.png")}/></a>
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
                                <input type="text" className="search-bar" onKeyUp={searchFollowedUsers} placeholder="Creator name" ref={(c) => find = c}/>
                                <a className="search-button" ><img className="clickable-icon search-icon" alt="Search" src={require("../img/search.png")}/></a>
                            </form>

                            <div className="search-criteria-div">
                                <h3 className="search-criteria"> Search Criteria</h3>
                                <a className="criteria-question-button" onClick={() => {setQuizorusers(0);search()}} ><img className="clickable-icon criteria-question-icon" alt="Search Questions" src={require("../img/quizempty.png")}/></a>
                                <a className="criteria-user-button"><img className="criteria-user-icon" alt="Search Users" src={require("../img/userfull.png")}/></a>
                            </div>

                            <div className="search-filters-div">
                                <h3 className="search-filters"> Search Filter</h3>
                                <a className="filter-add-user-button" onClick={toggleFollowUsers}><img className="clickable-icon filter-add-user-icon" alt="0" id="Search By Users You're Following"src={require("../img/adduserempty.png")}/></a>
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