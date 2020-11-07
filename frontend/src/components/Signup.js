import React, {useState} from 'react';
import useTogglePassword from "../hooks/useTogglePassword"; 
import './Login.css';
function Signup()
{
    var newEmail;
    var newUsername;
    var newPassword;
    var samePassword;

    const [message, setMessage] = useState('');

    const doSignup = async event => {
        event.preventDefault();
        alert('doIt() ' + newEmail+ '' + newUsername.value + '' + newPassword.value);
    };
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
                            <a class="btn" id="signup" type="button" href="./ConfirmEmail"><i class="fa fa-sign-in-alt"></i> Sign up </a>
                
                        </form>

                        <a class="login-signup-link links" href="./Login">Log in</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;