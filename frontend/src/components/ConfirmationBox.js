import React from 'react';
import './ConfirmEmailPWBox.css';

function ConfirmationBox() {

    return (
        <div>
            <div class="modal-dialog text-center row">
                <div class="col-md-12 fp-box">
                    <div class="modal-content">
                        <h2>Your Account Has Been Verified</h2>
                        <p>Enjoy using Athena</p>
                    </div>
                </div>
                
            </div>
            <div class="row text-center">
                <a class="col-md-4 btn" id="return-to-login" type="button" href="./"><i class="fa fa-sign-in-alt"></i> Log In </a>
            </div>
        </div>
        
    );
};

export default ConfirmationBox;