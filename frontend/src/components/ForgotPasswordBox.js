import React from 'react';
import './ForgotPasswordBox.css';

function ForgotPasswordBox() {

    var email;
    
    const doConfirm = async event => {}

    return (
        <div>
            <div class="modal-dialog text-center row">
                <div class="col-md-8 pw-boxes">
                    <div class="modal-content">
                        <form class="col-12" onSubmint={doConfirm}>
                        <div class="form-group usernameBox">
                            <input type="text" id="email" class="form-control" placeholder="Email" ref={(c) => email = c} />
                        </div>
                        <a class="btn" id="passwordChange" type="button" href="./ConfirmEmailPW"><i class="fa fa-sign-in-alt"></i> Request Password Change </a>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
        

    );
};

export default ForgotPasswordBox;