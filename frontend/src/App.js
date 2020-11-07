import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, BrowserRouter, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Navigation from './components/Navigation';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

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
        <Route path="/ConfirmEmail" exact>
          <ConfirmEmailPage />
        </Route>
        <Route path="/confirmation" exact>
          <ConfirmationPage />
        </Route>
        <Route path="/ResetPassword" exact>
          <ResetPasswordPage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}



export default App;
