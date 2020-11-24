import React, { useState } from 'react';
import Popup from "reactjs-popup";
import Header from '../components/Header';
import './NewQuizPage.css';
import HelpEditQuiz from '../components/HelpEditQuiz';

const EditQuizPage = () =>
{

    
    var [questions, setQuestions] = useState([{quest: "", answer: ""},]);

    const saveQuiz = async event => {
        event.preventDefault();

        /* TO DO */

        window.location.href="./MyQuizzes";
    };

    const addQuestion = async event => {
        event.preventDefault();

        /* TO DO */
        /* Add {quest: "", answer: ""} to the questions array */

        const item = {quest: "", answer: ""}
        setQuestions(questions => [...questions, item])
    };

    function removeQuestion(e) {
    

        /* TO DO */
        /* If question.length > 1, remove the selected element from the questions array. If question.length === 1, alert the user saying "You can't remove the only question" */

        if (questions.length === 1)
        {
            alert("You can't remove the only question");
        }
        else
        {
            // /* Add values from text boxes to questions array */
            // for (var j = 0; j < questions.length; j++)
            // {
            //     let id = "quiz-questions-" + j.toString();
            //     questions[j].quest = document.getElementById(id).value;
            // }
            
            /* Remove the selected element from the questions array*/
            questions.splice(e.target.id-1,1);
            questions = questions
            setQuestions(questions => [...questions]);
            
        }
    };


    var i = 0;

    const renderQuestion = (question, index) =>
    {
        i++;
        var nameq = "quiz-question-" + i.toString();
        var namea = "quiz-answer-" + i.toString();
        var idq = "quiz-questions-" + i.toString();
        var ida = "quiz-answer-" + i.toString();
        var placeholderq = "Question " + i.toString();
        var placeholdera = "Answer " + i.toString();
        var val = "" + i.toString();

        return (
            <tr key={index}>
                <textarea className="short-inputs" name={nameq} id={idq} placeholder={placeholderq}/>
                <textarea className="short-inputs" name={namea} id={ida} placeholder={placeholdera}/>
                <a className="remove-question" onClick={removeQuestion}><img id={val} className="clickable-icon" alt="Remove" src={require("../img/remove.png")}/></a>
                
                <script>
                    if (i===questions.length)
                        i=0
                </script>
            
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
                            <HelpEditQuiz />
                        </Popup>
                    </div>

                    <div className="col-6 column2 vh-100">
                        <form className="save-quiz-form">
                            <input type="text" className="long-inputs" id="quiz-title" placeholder="Quiz Title"/>
                            <a className="save-quiz" onClick={saveQuiz}><img className="clickable-icon" alt="Save" src={require("../img/save.png")}/></a>

                            <div className="questions-answers">
                                <table className="add-edit-table">
                                    <tbody>
                                        {questions.map(renderQuestion)}
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

export default EditQuizPage;