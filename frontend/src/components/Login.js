import React, { useState } from 'react';
import './Login.css';
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

  // const [message, setMessage] = useState('');

  const doLogin = async event => {
    event.preventDefault();
/*
    // trying to figure out how to connect react to express/node.js
    var obj = {Username:loginName.value, Email:loginName.value, Password:loginPassword.value};
    var js = JSON.stringify(obj);

    try{
      const response = await fetch(buildPath('./routes/api'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
      
      var res = JSON.parse(await response.text());

      if(res.id <= 0)
      {
        setMessage('User/Password combination incorrect');
      }
      else
      {
        var user = {Username:res.Username, Email:res.Email, id:res.id};
        localStorage.setItem('user_data', JSON.stringify(user));
        setMessage('');
        window.location.href = '../pages/LandingPage';
      }
    }
    catch(e)
    {
      alert(e.toString());
      return;
    }  */

    alert('doIt() ' + loginName.value + ' ' + loginPassword.value);
  };

  // Password Visablility Toggling
  const [PasswordInputType, ToggleIcon] = useTogglePassword();

  return (
    <div id="loginDiv">

      {/* Login Box */}
      <div class="modal-dialog text-center row">
        <div class="col-md-8 login-box">
          <div class="modal-content">
            <form class="col-12" onSubmit={doLogin}>
              
              <div class="form-group usernameBox">
                <input type="text" id="loginName" class="form-control" placeholder="Username or Email" ref={(c) => loginName = c} />
              </div>

              <div class="form-group passwordBox">
                <input type={PasswordInputType} id="loginPassword" class="form-control" placeholder="Password" ref={(c) => loginPassword = c} />
                <span class="password-icon">{ToggleIcon}</span>
              </div>

              <div class="checkbox-class">
                  <input type="checkbox" id="remember" /> Remember Me
              </div>
              

              <button class="btn" id="login" type="button" onClick={doLogin}><i class="fa fa-sign-in-alt"></i> Log In </button>

            </form>

              <a class="signup-login-link links" href="./Signup">Create Account</a> 

              <a class="forgot-password-link links" href="./ForgotPassword">Forgot Password?</a> 
              
              <p id="response"></p> {/*error messages for login go here*/}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
