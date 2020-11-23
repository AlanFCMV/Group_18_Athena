
import React from 'react';
import './ConfirmEmailPWBox.css';

function ConfirmEmailSUBox() {
    const appName = 'athena18'
    function buildPath(route){
        if(process.env.NODE_ENV ==='production'){
        return 'https://' + appName + '.herokuapp.com/' + route;
        }
        else{
        return 'http://localhost:5000/' + route;
        }
    }

    var email;

    const doResend = async event => {
        event.preventDefault();

        var obj = { Email:email.value};
        var js = JSON.stringify(obj);

        if(email.value)
        {   
            console.log("inside email")
            try{
                const response = await fetch(buildPath('api/resend'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
                var res = JSON.parse(await response.text());
                document.getElementById('addError').innerHTML = res.msg;
            }
            catch(e)
            {
                return;
            }
        }
        
        else{
            console.log("not working")
            document.getElementById('addError').innerHTML = "Please enter an email address";
        }
    }

    return (
        <div>
            <div class="modal-dialog text-center row">
                <div class="col-md-12 fp-box">
                    <div class="modal-content">
                        <h2>Confirmation Email Sent</h2>
                        <p>Click the link you find in the email and you’ll be brought back to Athena</p>
                        <p>If you do not see the email, check your spam folder or resend it here</p>
                    </div>
                </div>
            </div>

            <div class = "modal-dialog text-center row">
                <div class = "col-md-7 pw-boxes">
                    <div class = "modal-content">
                        <form class="col-12">
                            <div class="form-group usernameBox">
                                <input type="text" id="email" class="form-control" placeholder="Please re-enter email here" ref={(c) => email = c} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="row text-center">
                <button class="col-md-4 btn" id="resend-email" type="button" onClick={doResend}><i class="fa fa-sign-in-alt"></i> Resend Email </button>
            </div>

            <div class="modal-dialog text-center row">
                
                    <div class="modal-content">
                        <p id='addError'></p>
                    </div>
                
            </div>
            

        </div>
    );
};

export default ConfirmEmailSUBox;