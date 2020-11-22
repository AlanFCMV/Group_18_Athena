import React, {useState} from 'react';
import useTogglePassword from "../hooks/useTogglePassword"; 
import './Login.css';
function Signup()
{
    const appName = 'athena18'
    function buildPath(route){
    if(process.env.NODE_ENV ==='production'){
      return 'https://' + appName + '.herokuapp.com/' + route;
    }
    else{
      return 'http://localhost:5000/' + route; 
    }
  }
    var newEmail;
    var newUsername;
    var newPassword;
    var samePassword;

    const [message, setMessage] = useState('');

    const doSignup = async event => {
        event.preventDefault();

        var obj = {Username:newUsername.value, Password:newPassword.value, Email:newEmail.value};
        var js = JSON.stringify(obj);
        if(newEmail.value && newUsername.value && newPassword.value && samePassword.value){
            
            if (newPassword.value === samePassword.value)
            {
            
                try{
                    console.log("In the try")
                    const response = await fetch(buildPath('api/register'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                    console.log(response)
                    var res = JSON.parse(await response.text());
        
                    if(res.error)
                    {   
                        document.getElementById('addError').innerHTML = res.error;
                    }
                    
                    else{
                        console.log("working")
                        console.log(newEmail.value)
                        var user ={Username:res.Username, Email:res.Email, Password:res.Password};
                        localStorage.setItem('user', JSON.stringify(user));
                        window.location.href = "./ConfirmEmailSU";
                    }
                }

                catch(e)
                {
                //alert(e.toString());
                return;
                }
            }
            else{
                document.getElementById('addError').innerHTML = "Passwords do not match, please try again";
            } 
        }
        
        else{
            document.getElementById('addError').innerHTML = "Please fill out all fields";
        }

       // alert('doIt() ' + newEmail+ '' + newUsername.value + '' + newPassword.value);
    }

    // Password Toggling
    const [PasswordInputType, ToggleIcon] = useTogglePassword();
    const [ConfirmPasswordType, secondToggleIcon] = useTogglePassword();

    return(
        <div id="signupDiv">
            {/* Signup Box */}
            <div class ="modal-dialog text-center row">
                <div class ="col-md-8 login-box">
                    <div class ="modal-content">
                        <form class="col-12" onSubmint={doSignup}>

                            <div class ="form-group usernameBox">
                                <input type="text" id="newEmail" class="form-control" placeholder="Email" ref={(c) => newEmail = c} />
                            </div>

                            <div class ="form-group usernameBox">
                                <input type="text" id="newUsername" class="form-control" placeholder="Username" ref={(c) => newUsername = c} />
                            </div>

                            <div class="form-group passwordBox">
                                <input type={PasswordInputType} id="newPassword" class="form-control" placeholder="Password" ref={(c) => newPassword = c} />
                                <span class="password-iconSignup">{ToggleIcon}</span>
                            </div>

                            <div class="form-group confirmPasswordBox">
                                <input type={ConfirmPasswordType} id="confirmPassword" class="form-control" placeholder=" Confirm Password" ref={(c) => samePassword = c} />
                                <span class="password-iconConfirmSignup">{secondToggleIcon}</span>
                            </div>

                            {/* <button class="btn" id="signup" type="button" onClick={doSignup}><i class="fa fa-sign-in-alt"></i> Sign up </button> */}
                            <a class="btn" id="signup" type="button"  onClick={doSignup}><i class="fa fa-sign-in-alt"></i> Sign up </a>
                
                        </form>

                        <a class="login-signup-link links" href="./Login">Log in</a>

                        <p id="addError"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;