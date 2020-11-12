import React from 'react';
import './ResetPasswordBox.css';
import useTogglePassword from '../hooks/useTogglePassword';

function ResetPasswordBox() {

    var newPassword;
    var samePassword;
    
    const doConfirm = async event => {}

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
                            <a class="btn" id="signup" type="button" href="./"><i class="fa fa-sign-in-alt"></i> Reset Password </a>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
        

    );
};

export default ResetPasswordBox;