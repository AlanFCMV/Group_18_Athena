import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, BrowserRouter, Link } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import Login from './components/Login';
import SignupPage from './pages/SignupPage';
import Navigation from './components/Navigation';

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
        <Route path="/cards" exact>
          <CardPage />
        </Route>
        <Redirect to="/" />
      </Switch>  
    </Router>
  );
}



export default App;
