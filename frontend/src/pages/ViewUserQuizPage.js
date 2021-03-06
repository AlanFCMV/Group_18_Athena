import React, { useState, Components, useEffect, useRef, useCallback } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './ViewUserQuizPage.css';
import HelpViewUserQuiz from '../components/HelpViewUserQuiz';

const ViewUserQuizPage = () =>
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
            console.log(res)
            document.getElementById("quizTitle").innerHTML = res.Name;
            await setCards([]);
            await setCards(res.Cards);
            var time = res.CreatedAt.substring(0,10);
            console.log(res.LikedBy.length)
            document.getElementById('carousel').innerHTML = res.Cards[0].Question;
            document.getElementById('date-created').innerHTML = "Date Created: " + time;
            document.getElementById('like-count').innerHTML = "Likes: " + res.LikedBy.length;
            p = document.getElementById('carousel');
            p.innerHTML = (questionOrAnswer === 0) ? cards[position].Question : cards[position].Answer;
        }
        catch(e){
            return;
        }
       
    }

    const doDelete = async () => {
        if(window.confirm("Are you sure you want to delete this set?")){
            var quizID = localStorage.getItem('quizID');
            var newId = JSON.parse(quizID)
            var obj = {_id:newId}
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
    const cardSaver = async ()=>{
        var quizID = localStorage.getItem('quizID');
        var newId = JSON.parse(quizID)
        localStorage.setItem('quizID',JSON.stringify(newId));
        window.location.href = "/EditQuiz";
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

    return (
        <div>
            <div className="container-fluid vh-100">
                <div className="row">
                    <div className="col-3 column1 vh-100">

                
                        <div className="stats-div">
                            <h3 id="like-count">Likes: </h3>
                            <h3 id="date-created">Date Created: </h3>
                            <p id='addError'></p>
                        </div>
                        
                        <Popup trigger={
                            <a className="help">
                                <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                            </a>
                        } position="top right">
                            <HelpViewUserQuiz />
                        </Popup>
                    </div>

                    <div className="col-6 column2 vh-100 carousel-col">
                        <div className="quiz-title-div">
                            <h3 className="quiz-title"id="quizTitle"></h3>
                        </div>

                        <div className="container carousel-container align-items-center" onClick={flipCards}>
                            <button id="left-btn" class="carousel-btn" onClick={moveLeft}><i class="arrow"></i></button>
                            <p id="carousel"></p>
                            <button id="right-btn" class="carousel-btn" onClick={moveRight}><i class="arrow"></i></button>
                        </div>
                        <div className="buttons-div">
                            <a className="view-user-quiz-buttons" onClick={()=> cardSaver()}><img className="clickable-icon view-user-quiz-icon" src={require("../img/edit.png")} /></a>
                            {/* <a className="view-user-quiz-buttons" onClick={loadQuiz}><img className="clickable-icon view-user-quiz-icon" src={require("../img/flip.png")} /></a> */}
                            <a className="view-user-quiz-buttons" onClick={()=> doDelete()}><img className="clickable-icon view-user-quiz-icon" src={require("../img/delete.png")} /></a>
                        </div>
                        
                    </div>

                    <div className="col-3 column3 vh-100"></div>
                </div>
            </div>
            <Header />
        </div>

        

    );
};

export default ViewUserQuizPage;