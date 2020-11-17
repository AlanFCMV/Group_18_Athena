import React from 'react';
import './ConfirmEmailPWBox.css';

function ConfirmEmailSUBox() {

    var email="\"insert email here\""

    return (
        <div>
            <div class="modal-dialog text-center row">
                <div class="col-md-12 fp-box">
                    <div class="modal-content">
                        <h2>Confirmation Email Sent</h2>
                        <p>We sent an email to {email}</p>
                        <p>Click the link you find in the email and you’ll be brought back to Athena</p>
                        <p>If you do not see the email, check your spam folder or resend it here</p>
                    </div>
                </div>
            
            </div>
            <div class="row text-center">
                <button class="col-md-4 btn" id="resend-email" type="button" onClick={""}><i class="fa fa-sign-in-alt"></i> Resend Email </button>
            </div>
            
        </div>
        

    );
};

export default ConfirmEmailSUBox;