import React from 'react';
import './ResetPasswordBox.css';
import useTogglePassword from '../hooks/useTogglePassword';
import { useParams } from 'react-router-dom';


function ResetPasswordBox() {
    const appName = 'athena18'
    function buildPath(route){
    if(process.env.NODE_ENV ==='production'){
      return 'https://' + appName + '.herokuapp.com/' + route;
    }
    else{
      return 'http://localhost:5000/' + route; 
    }
  }

    var newPassword 
    var samePassword;

    const { token } = useParams();
    
    const doConfirm = async event => {

        var obj = {TokenId:token, Password:newPassword.value};
        var js = JSON.stringify(obj);
        if(newPassword.value && samePassword.value){
            try{
                const respone = await fetch(buildPath('api/updatepassword'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var res = JSON.parse(await respone.text());
            
                if(newPassword.value != samePassword.value){
                    document.getElementById('addError').innerHTML = "Passwords do not match, please try again";
                }
                else{
                    
                    var user={Password:res.Password};
                    localStorage.setItem('user', JSON.stringify(user));
                    document.getElementById('addError').innerHTML = "The account password has been reset. Sending you back to Login.";
                    setTimeout(function() {window.location.assign("http://athena18.herokuapp.com")},5000);
                
                }
        
            }
            catch(e){
                return;
            }
            
        }
        else{
            document.getElementById('addError').innerHTML = "Please fill out both fields";
        }
        
    }

    // Password Toggling
    const [PasswordInputType, ToggleIcon] = useTogglePassword();
    const [ConfirmPasswordType, secondToggleIcon] = useTogglePassword();


    return (
        <div>
            <div class="modal-dialog text-center row">
                <div class="col-md-8 pw-boxes">
                    <div class="modal-content">
                        <form class="col-12" onSubmint={doConfirm}>
                            <div class="form-group passwordBox">
                                <input type={PasswordInputType} id="newPassword" class="form-control" placeholder="Password" ref={(c) => newPassword = c} />
                                <span class="password-iconReset">{ToggleIcon}</span>
                            </div>
                            <div class="form-group confirmPasswordBox">
                                <input type={ConfirmPasswordType} id="confirmPassword" class="form-control" placeholder=" Confirm Password" ref={(c) => samePassword = c} />
                                <span class="password-iconConfirmReset">{secondToggleIcon}</span>
                            </div>
                            <a class="btn" id="signup" type="button" onClick={doConfirm}><i class="fa fa-sign-in-alt"></i> Reset Password </a>
                        </form>
                        <p id='addError'></p>
                    </div>
                </div>
                
            </div>
        </div>
        

    );
};

export default ResetPasswordBox;
