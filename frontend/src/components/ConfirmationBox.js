import React from 'react';
import './ConfirmEmailPWBox.css';
import { useParams } from 'react-router-dom';

function ConfirmationBox() {
    const appName = 'athena18'
    function buildPath(route){
    if(process.env.NODE_ENV ==='production'){
      return 'https://' + appName + '.herokuapp.com/' + route;
    }
    else{
      return 'http://localhost:5000/' + route; 
    }
  }
    const { token } = useParams();

    window.onload = async event => {
        event.preventDefault();

        var obj = {TokenId:token};
        var js = JSON.stringify(obj);
        
        try{
            console.log("Made it")
            const response = await fetch(buildPath('api/confirmation'), {method:'POST', body:js,headers:{'Content-Type': 'application/json'}});
            //var res = JSON.parse(await response.text());
            //console.log(res.msg)
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }


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