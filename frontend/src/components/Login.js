import React, { useState } from 'react';
import './Login.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTogglePassword from "../hooks/useTogglePassword";


function Login() {
/*
  const appName = 'athena18'
  function buildPath(route){
    if(ProcessingInstruction.env.NODE_ENV ==='production'){
      return 'https://' + appNAME + '.herokuapp.com/' + route;
    }
    else{
      return 'http://localhost:5000/' + route;
    }
  }*/

  var loginName;
  var loginPassword;

  const [message, setMessage] = useState('');

  const doLogin = async event => {
    event.preventDefault();
   /* var obj = {login:loginName.value, password:loginPassword.value};
    var js = JSON.stringify(obj);

    try{
      const response = await fetch(buildPath('api/login'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
      
      var res = JSON.parse(await response.text());

      if(res.id <= 0)
      {
        setMessage('User/Password combination incorrect');
      }
      else
      {
        var user = {}
      }
    }*/

    alert('doIt() ' + loginName.value + ' ' + loginPassword.value);
  };

  // Password Visablility Toggling
  const [PasswordInputType, ToggleIcon] = useTogglePassword();

  return (
    <div id="loginDiv">
      <div class="box1">
        <form onSubmit={doLogin}>
          <div class="usernameBox">
            <input type="text" id="loginName" placeholder="Email or Username" ref={(c) => loginName = c} />
          </div>
          <div class="passwordBox">
            <input type={PasswordInputType} id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />{ToggleIcon}
          </div>
          <div class="rememberMe">
           <input type="checkbox" id="remember"/>Remember Me
          </div>
          <div>
            <input type="submit" id="loginButton" class="buttons" value="Log In" onClick={doLogin} />
          </div>
          <p id="response"></p> {/*error messages for login go here*/}
        </form>

        <a class="signup-login-link" href="Signup.js">Click Here To Sign Up</a>    
      </div>
    </div>
  );
};

export default Login;
