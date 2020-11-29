import React, { useState, Components, useEffect, useRef, useCallback } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './ViewGlobalQuizPage.css';
import HelpViewGlobalQuiz from '../components/HelpViewGlobalQuiz';

const ViewGlobalQuizPage = () =>
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

    async function flipCards(){
        questionOrAnswer = 1-questionOrAnswer;
        p = document.getElementById('carousel');
        p.innerHTML = (questionOrAnswer === 0) ? cards[position].Question : cards[position].Answer;
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

    var questionOrAnswer = 0;
    const [cards, setCards] = useStateWithPromise([]); 
    
    const [isFollowing, setIsFollowing] = useState(0);
    var position = 0;
    var p;

    window.onload = function(){loadQuiz()};

    async function loadQuiz()
    {   var quizID = localStorage.getItem('quizID');
        var data = JSON.parse(quizID);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);
        try{
            const response = await fetch(buildPath('api/infoset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            // console.log(res)
            document.getElementById("quiz-title").innerHTML = res.Name;
            await setCards([]);
            await setCards(res.Cards);
            var time = res.CreatedAt.substring(0,10);
            // console.log(time)
            document.getElementById('carousel').innerHTML = res.Cards[0].Question;
            document.getElementById('date-created').innerHTML = "Date Created: " + time;
            document.getElementById('like-count').innerHTML = "Likes: " + res.LikedBy.length;
        }
        catch(e){
            console.log("error");
            return;
        }

        data = res.Creator;
        obj = {UserId:data};
        js = JSON.stringify(obj);
        try {
            const idResponse = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var idRes = JSON.parse(await idResponse.text());
            document.getElementById("quiz-user").innerHTML = idRes.Username;
        }

        catch(e) {
            return;
        }

        var initialLikedState = await isQuizLiked();
        if(initialLikedState)
        {
            console.log("initializing like button to be full");
            document.getElementById("like-button-to-toggle").src = require("../img/addlikefull.png");
        }
        else
        {
            console.log("initializing like button to be empty");
            document.getElementById("like-button-to-toggle").src = require("../img/addlikeempty.png");
        }

        var initialFollowState = await isUserFollowing();
        if(initialFollowState)
        {
            console.log("initializing follow button to be full");
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserfull.png");
        }
        else
        {
            console.log("initializing follow button to be empty");
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserempty.png");
        }   
    }

    const moveRight = () => {
        questionOrAnswer = 1;
        if (position >= cards.length - 1) {
            position = 0;
            document.getElementById('carousel').innerHTML = (questionOrAnswer === 0) ? cards[position].Question : cards[position].Answer;
            return;
        }
        document.getElementById('carousel').innerHTML = (questionOrAnswer === 0) ? cards[position+1].Question : cards[position+1].Answer;
        position++;
    }

    const moveLeft = () => {
        questionOrAnswer = 1;
        if (position < 1) {
            position = cards.length - 1;
            document.getElementById('carousel').innerHTML = (questionOrAnswer === 0) ? cards[position].Question : cards[position].Answer;
            return;
        }
        p.innerHTML = (questionOrAnswer === 0) ? cards[position-1].Question : cards[position-1].Answer;
        position--;
    }

    const goToUsersPage = () =>
    {
        window.location = "./ViewUser";
    }

    async function isQuizLiked()
    {
        var isQuizLiked = 0;
        var quizID = localStorage.getItem('quizID');
        var data = JSON.parse(quizID);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);
        var user = localStorage.getItem('user');
        var userdata = JSON.parse(user);
        var userobj = userdata.UserId;
        try{
            const response = await fetch(buildPath('api/infoset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());

            for (let i = 0; i < res.LikedBy.length; i++)
            {   
                if (res.LikedBy[i] === userobj)
                {
                    isQuizLiked = 1;
                    break;
                }
            }
        }
        catch(e){
            console.log("error");
            return;
        }

        console.log("isQuizLiked: " + isQuizLiked);
        return isQuizLiked;
    }

    async function updateLikes()
    {
        var quizID = localStorage.getItem('quizID');
        var data = JSON.parse(quizID);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);
        try{
            const response = await fetch(buildPath('api/infoset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            document.getElementById('like-count').innerHTML = "Likes: " + res.LikedBy.length;
        }
        catch(e){
            console.log("error");
            return;
        }
    }

    async function likeQuiz(){
        var quizId = localStorage.getItem('quizID');
        var data = JSON.parse(quizId);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);

        var userInfo = localStorage.getItem('user');
        var blah = JSON.parse(userInfo);
        try{
            const response = await fetch(buildPath('api/like'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
            updateLikes();
        }
        catch(e){
            return;
        }
    }
    async function unLikeQuiz(){
        var quizId = localStorage.getItem('quizID');
        var data = JSON.parse(quizId);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);

        var userInfo = localStorage.getItem('user');
        var blah = JSON.parse(userInfo);
        try{
            const response = await fetch(buildPath('api/unlike'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
            updateLikes();
        }
        catch(e){
            return;
        }
    }

    async function toggleLikes()
    {
        var newLikedState = await isQuizLiked();
        if(newLikedState)
        {
            await unLikeQuiz();
            document.getElementById("like-button-to-toggle").src = require("../img/addlikeempty.png");
        }
        else
        {
            await likeQuiz();
            document.getElementById("like-button-to-toggle").src = require("../img/addlikefull.png");
        }   
    }

    async function isUserFollowing()
    {
        var isUserFollowing = 0;
        var quizID = localStorage.getItem('quizID');
        var data = JSON.parse(quizID);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);
        
        var user = localStorage.getItem('user');
        var userdata = JSON.parse(user);
        var userobj = userdata.UserId;
        var idRes;
        try{
            const response = await fetch(buildPath('api/infoset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            data = res.Creator;
            obj = {UserId:data};
            js = JSON.stringify(obj);
            try {
                const idResponse = await fetch(buildPath('api/infouser'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                idRes = JSON.parse(await idResponse.text());
            }
    
            catch(e) {
                return;
            }


            for (let i = 0; i < idRes.Followers; i++)
            {   
                if (idRes[i].Followers === userobj)
                {
                    isUserFollowing = 1;
                    break;
                }
            }
        }
        catch(e){
            console.log("error");
            return;
        }

        console.log("isUserFollowing: " + isUserFollowing);
        return isUserFollowing;
    }


    async function followUser(){
        var quizId = localStorage.getItem('quizID');
        var data = JSON.parse(quizId);
        console.log("quizId: " + quizId + " data: " + data);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);
        var quizCreator;

        try {
            const infosetResponse = await fetch(buildPath('api/infoset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var infores = JSON.parse(await infosetResponse.text());
            quizCreator = infores.Creator;
        }

        catch(e) {
            return;
        }

        var userInfo = infores.Creator;
        console.log(userInfo);
        var blah = userInfo;
        try{
            const response = await fetch(buildPath('api/follow'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
        }
        catch(e){
            return;
        }
    }

    async function unFollowUser(){
        var quizId = localStorage.getItem('quizID');
        var data = JSON.parse(quizId);
        var obj = {SetId:data};
        var js = JSON.stringify(obj);
        var quizCreator;

        try {
            const infosetResponse = await fetch(buildPath('api/infoset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var infores = JSON.parse(await infosetResponse.text());
            quizCreator = infores.Creator;
        }

        catch(e) {
            return;
        }

        var userInfo = infores.Creator;
        var blah = JSON.parse(userInfo);
        try{
            const response = await fetch(buildPath('api/unfollow'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ blah.accessToken)}});
            var res = JSON.parse(await response.text());
        }
        catch(e){
            return;
        }
    }

    async function toggleFollowing()
    {
        var newFollowingState = await isUserFollowing();
        if (newFollowingState)
        {
            await unFollowUser();
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserempty.png");
        }
        else
        {
            await followUser();
            document.getElementById("follow-button-to-toggle").src = require("../img/adduserfull.png");
        }
    }

    return (
        <div>
            <div className="container-fluid vh-100">
                <div className="row">
                    <div className="col-3 column1 vh-100">

                
                        <div className="stats-div">
                            <h3 id="like-count">Likes: </h3>
                            <h3 id="date-created">Date Created: </h3>
                        </div>
                        
                        <Popup trigger={
                            <a className="help">
                                <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                            </a>
                        } position="top right">
                            <HelpViewGlobalQuiz />
                        </Popup>
                    </div>

                    <div className="col-6 column2 vh-100 carousel-col">
                        <div className="quiz-title-user-div">
                            <h3 className="quiz-title" id="quiz-title">Quiz Title</h3>
                            <h3 className="quiz-user" id="quiz-user" onClick={goToUsersPage}>By User Name</h3>
                        </div>
                        
                        <div className="container carousel-container align-items-center" onClick={flipCards}>
                            <button id="left-btn" class="carousel-btn" onClick={moveLeft}><i class="arrow"></i></button>
                            <p id="carousel"></p>
                            <button id="right-btn" class="carousel-btn" onClick={moveRight}><i class="arrow"></i></button>
                        </div>
                        <div className="buttons-div">
                            <a className="view-user-quiz-buttons" onClick={toggleLikes}><img className="clickable-icon view-user-like-icon" id="like-button-to-toggle" src={""} /></a>
                            {/* <a className="view-user-quiz-buttons" onClick={loadQuiz}><img className="clickable-icon view-user-quiz-icon" src={require("../img/flip.png")} /></a> */}
                            <a className="view-user-quiz-buttons" onClick={toggleFollowing}><img className="clickable-icon view-user-follow-icon" id="follow-button-to-toggle" src={""} /></a>
                        </div>
                        
                    </div>

                    <div className="col-3 column3 vh-100"></div>
                </div>
            </div>
            <Header />
        </div>

        

    );
};

export default ViewGlobalQuizPage;