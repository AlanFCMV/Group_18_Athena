import React, { useState } from 'react';
import './Login.css';

function Login() {
  var loginName;
  var loginPassword;

  const [message, setMessage] = useState('');

  /*const doLogin = async event => {
    event.preventDefault();

    alert('doIt() ' + loginName.value + ' ' + loginPassword.value);
  };*/

  return (
    <div id="loginDiv">
      <div class="title">
        <span class="titleA">A</span><span class="titleThena">thena</span>
      </div>
      
      <div style="background: url(./gold.jpg);">
        <form onSubmit={doLogin}>
          
          <input type="text" id="loginName" placeholder="Email or Username" ref={(c) => loginName = c} />
          <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
          <span toggle="#password" id = "pwd" class="fa fa-fw fa-eye field-icon pwd"></span>
          <input type="checkbox" id="remember"> Remember Me</input>
          <input type="submit" id="loginButton" class="buttons" value="Do It" onClick={doLogin} />
          <p id="response"></p> {/*error messages for login go here*/}
        </form>

        <a class="signup-login-link" href="Signup.js"></p>    
      </div>
    </div>
  );
};

export default Login;
