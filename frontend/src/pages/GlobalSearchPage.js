import React, { useState } from 'react';
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

    const search = async event => {
        event.preventDefault();
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
    const userSearch= async event =>{
        event.preventDefault();
        
        var userstate = [];

        var obj2={Search:find.value};
        var js2 = JSON.stringify(obj2);
        const response2 = await fetch(buildPath('api/searchuserglobaldate'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
        var res2 = JSON.parse(await response2.text());
        for(var i = 0; i < res2.length; i++){
            
            try{
                const response3 = await fetch(buildPath('api/searchuserglobaldate'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
                var res3 = JSON.parse(await response3.text());
                
                userstate.push({UserName:res3[i].Username, id:res3[i]._id})
            }
            catch(e){
                return
            }
        }
        setUsers(userstate);
    }

    async function firstSearch(){
        var obj = {Search:find.value};
        var js = JSON.stringify(obj);
        const response = await fetch(buildPath('api/searchsetglobaldate'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}}); 
        var res = JSON.parse(await response.text());

       
        var userstate = [];

        var obj2={Search:find.value};
        var js2 = JSON.stringify(obj2);
        const response2 = await fetch(buildPath('api/searchuserglobaldate'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
        var res2 = JSON.parse(await response2.text());
        for(var i = 0; i < res2.length; i++){
            
            try{
                const response3 = await fetch(buildPath('api/searchuserglobaldate'), {method:'POST', body:js2,headers:{'Content-Type': 'application/json'}});
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

    const [searchQuizzesLiked, setSearchQuizzesLiked] = useState(0);
    const [searchQuizzesFollowing, setSearchQuizzesFollowing] = useState(0);
    const [searchUsersFollowing, setSearchUsersFollowing] = useState(0);

    const cardSaver = async(name) => {
        localStorage.setItem('quizID',JSON.stringify(name));
        window.location.href = "/viewglobalquiz";
    }
    const userCardSaver = async(name) => {
        localStorage.setItem('quizCreator',JSON.stringify(name));
        window.location.href = "/viewuser";

    }
    //LIKEDSEARCH
    async function likedSearch(){
        var userInfo = localStorage.getItem('user');
        var data = JSON.parse(user);
        var obj = {UserId:data._id, Search:find.value};
        var js = JSON.stringify(obj);
        try{
            const response = await fetch(buildPath('api/searchsetlikedlikes'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

        }
        catch(e){
            return;
        }

    }
    var [quizzes, setQuizzes] = useState([]);
    
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
                                <input type="text" className="search-bar" onKeyUp={search} placeholder="Search Quiz By Title" ref={(c) => find = c}/>
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
                                <input type="text" className="search-bar" onKeyUp={userSearch} placeholder="Creator name" ref={(c) => find = c}/>
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