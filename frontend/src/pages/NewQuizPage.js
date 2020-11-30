import React, { useState, Components, useEffect, useRef, useCallback } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './NewQuizPage.css';
import HelpNewQuiz from '../components/HelpNewQuiz';

const NewQuizPage = () =>
{
   
    const appName = 'athena18';
    function buildPath(route){
    if(process.env.NODE_ENV ==='production'){
      return 'https://' + appName + '.herokuapp.com/' + route;
    }
    else{
      return 'http://localhost:5000/' + route; 
    }
  }

  var name;

  const doAddSet = async event =>{
      event.preventDefault();
   
        updateCards();
        if(name.value){
      
          var obj = {Name:name.value, Cards:cards};
          var js = JSON.stringify(obj);
    
          var userInfo = localStorage.getItem('user');
          var data= JSON.parse(userInfo);
      
        
          try{
            const response = await fetch(buildPath('api/addset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json', 'authorization': ('BEARER '+ data.accessToken)}});
            var res = JSON.parse(await response.text());

            if(res.error){
                document.getElementById('addError').innerHTML = res.error;
            }
        }
        catch(e){
            return;
        }

        window.location.href="./MyQuizzes";
      }
      else
        document.getElementById('addError').innerHTML = "Please enter a Quiz Title!"
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

      const [cards, setCards] = useStateWithPromise([{Question: "", Answer: ""}]);


    const updateCards = () =>{
        
        for (let i = 0; i < cards.length; i++)
        {
            let idq = "question-id-" + i.toString();
            let ida = "answer-id-" + i.toString();
            let newCard = {
                "Question" : document.getElementById(idq).value,
                "Answer" : document.getElementById(ida).value
            }
            cards[i] = newCard;
        }
    }

    const addQuestion = () =>{
        
        updateCards();
        setCards([...cards, {Question: "", Answer: ""}]);
    }
    // const rem = (cards, remLoc) => {
    //     var remCards = [];
    //     for (let i=0; i<cards.length;i++)
    //     {
    //         let newCard = {
    //             Question: cards[i].Question,
    //             Answer: cards[i].Answer,
    //         }
    //         remCards.push(newCard);
    //     }
    //     remCards.splice(remLoc, 1);
    //     return remCards;
    // }

    async function removeQuestion(remLoc) {
        
        if (cards.length === 1)
        {
            alert("You can't remove the only question");
            return;
        }

        updateCards();
        console.log(remLoc);
        var remCards=[...cards];
        remCards.splice(remLoc, 1);
        // setCards(cards);
        //cards.splice(remLoc);
        // for (let k=0; k<cards.length; k++)
        // {
        //     console.log(JSON.parse(JSON.stringify(cards[k])))
        // }
        for (let k=0; k<cards.length; k++)
        {
            console.log(JSON.parse(JSON.stringify(cards[k])))
        }
        // for (let k=0; k<remCards.length; k++)
        // {
        //     console.log(JSON.parse(JSON.stringify(remCards[k])))
        // }
        await setCards([]);
        await setCards(remCards);
        for (let k=0; k<cards.length; k++)
        {
            console.log(JSON.parse(JSON.stringify(cards[k])))
        }
        // for (let k=0; k<remCards.length; k++)
        // {
        //     console.log(JSON.parse(JSON.stringify(remCards[k])))
        // }
    }

    var questionNumber = 0;
    const renderQuestion = (card, index) =>
    {
        console.log(card.Question);
        questionNumber++;
        var nameq = "quiz-question-" + questionNumber.toString();
        var namea = "quiz-answer-" + questionNumber.toString();
        var idq = "question-id-" + (questionNumber-1).toString();
        var ida = "answer-id-" + (questionNumber-1).toString();
        var placeholderq = "Question " + questionNumber.toString();
        var placeholdera = "Answer " + questionNumber.toString();
        var val = (questionNumber-1).toString();
        if (questionNumber===cards.length)
            questionNumber=0;

        return (
            <tr key={index}>
                <textarea className="short-inputs" name={nameq} id={idq} placeholder={placeholderq}>{card.Question}</textarea>
                <textarea className="short-inputs" name={namea} id={ida} placeholder={placeholdera}>{card.Answer}</textarea>
                <a className="remove-question" onClick={() => {removeQuestion(val);}}><img className="clickable-icon" alt="Remove" src={require("../img/remove.png")}/></a>
            </tr>
        )
    }
    return (
        <div>
            <div className="container-fluid vh-100">
                <div className="row">
                    <div className="col-3 column1 vh-100">
                        <Popup trigger={
                            <a className="help">
                                <img className="help-icon" alt="Help" src={require("../img/help.png")}/>
                                
                            </a>
                        } position="top right">
                            <HelpNewQuiz />
                        </Popup>       
                    </div>

                    <div className="col-6 column2 vh-100">
                        <form className="save-quiz-form">
                            <input type="text" className="long-inputs" id="quiz-title" placeholder="Quiz Title" ref={(c) => name = c}/>
                                <a className="save-quiz" onClick={doAddSet}><img className="clickable-icon" alt="Save" src={require("../img/save.png")}/></a>
                                <p id='addError' className="errorMessage"></p>
                            <div className="questions-answers">
                                <table className="add-edit-table">
                                    <tbody>
                                        {cards.map(renderQuestion)}
                                        <a className="add-question" onClick={addQuestion}><img className="clickable-icon" alt="Add" src={require("../img/add.png")}/></a>
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>

                    <div className="col-3 column3 vh-100"></div>
                </div>
            </div>
            <Header />
        </div>
    
    );
};

export default NewQuizPage;