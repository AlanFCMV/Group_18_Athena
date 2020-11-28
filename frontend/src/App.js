import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, BrowserRouter, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ConfirmEmailPWPage from './pages/ConfirmEmailPWPage';
import ConfirmEmailSUPage from './pages/ConfirmEmailSUPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MenuPage from './pages/MenuPage';
import NewQuizPage from './pages/NewQuizPage';
import MyQuizzesPage from './pages/MyQuizzesPage';
import GlobalSearchPage from './pages/GlobalSearchPage';
import EditQuizPage from './pages/EditQuizPage';
import ViewUserPage from './pages/ViewUserPage';
import ViewUserQuizPage from './pages/ViewUserQuizPage';
import ViewGlobalQuizPage from './pages/ViewGlobalQuizPage';

function App() {
  return (
    <Router >
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route path ="/Signup" exact>
          <SignupPage />
        </Route>
        <Route path="/ForgotPassword" exact>
          <ForgotPasswordPage />
        </Route>
        <Route path="/ConfirmEmailPW" exact>
          <ConfirmEmailPWPage />
        </Route>
        <Route path="/ConfirmEmailSU" exact>
          <ConfirmEmailSUPage />
        </Route>
        <Route path="/confirmation" exact>
          <ConfirmationPage />
        </Route>
        <Route path="/confirmation/:token">
          <ConfirmationPage />
        </Route>
        <Route path="/reset" exact>
          <ResetPasswordPage />
        </Route>
        <Route path="/reset/:token">
          <ResetPasswordPage />
        </Route>
        <Route path="/Menu" exact>
          <MenuPage />
        </Route>
        <Route path="/NewQuiz" exact>
          <NewQuizPage />
        </Route>
        <Route path="/MyQuizzes" exact>
          <MyQuizzesPage />
        </Route>
        <Route path="/GlobalSearch" exact>
          <GlobalSearchPage />
        </Route>
        <Route path="/EditQuiz" exact>
          <EditQuizPage />
        </Route>
        <Route path="/ViewUser" exact>
          <ViewUserPage />
        </Route>
        <Route path="/ViewUserQuiz" exact>
          <ViewUserQuizPage />
        </Route>
        <Route path="/ViewGlobalQuiz" exact>
          <ViewGlobalQuizPage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}



export default App;
