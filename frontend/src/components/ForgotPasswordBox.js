import React from 'react';
import './ForgotPasswordBox.css';

function ForgotPasswordBox() {
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
    
    const doConfirm = async event => {
        event.preventDefault();

        var obj = { Email:email.value};
        var js = JSON.stringify(obj);
        
        console.log(obj)
        try{
            
            console.log("inside try")
            const response = await fetch(buildPath('api/reset'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            var res = JSON.parse(await response.text());
            document.getElementById('addError').innerHTML = res.msg;
            console.log(res.status)
            
            //window.location.href = "./ConfirmEmailPW"
        }
        catch(e)
        {
            //alert(e.toString());
            return;
        }
    }

    return (
        <div>
            <div class="modal-dialog text-center row">
                <div class="col-md-8 pw-boxes">
                    <div class="modal-content">
                        <form class="col-12" onSubmint={doConfirm}>
                        <div class="form-group usernameBox">
                            <input type="text" id="email" class="form-control" placeholder="Email" ref={(c) => email = c} />
                        </div>
                        <a class="btn" id="passwordChange" type="button" onClick={doConfirm}><i class="fa fa-sign-in-alt"></i> Request Password Change </a>
                        </form>
                        <p id='addError'></p>
                    </div>
                </div>
                
            </div>
        </div>
        

    );
};

export default ForgotPasswordBox;