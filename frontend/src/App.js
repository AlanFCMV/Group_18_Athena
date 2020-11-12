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
import MenuPage from './pages/MenuPage.js';

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
        <Route path="/reset" exact>
          <ResetPasswordPage />
        </Route>
        <Route path="/menu" exact>
          <MenuPage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}



export default App;
