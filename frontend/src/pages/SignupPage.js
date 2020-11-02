import React from 'react';

import PageTitle from '../components/PageTitle';
import Signup from '../components/Signup';

import './LoginPage.css';
import SiteInfo from '../components/SiteInfo';
import SiteImages from '../components/SiteImages';

const SignupPage = () =>
{
    return(
        <div class ="container-fluid my-container vh-100">
            <div class="row my-row flex-row-reverse vh-100">
                <div class="col-sm-7 right">
                    <div class ="login-box">
                        <PageTitle />
                        <Signup />
                    </div>
                </div>

                <div class="col-sm-5 left vh-100">
                        <div class="row top-left">
                            <div class="image-box">
                                <SiteImages />
                            </div>
                        </div>
                        <div class="row bottom-left">
                            <div class="info-box">
                                <SiteInfo />
                            </div>
                        </div>
                </div>
            </div>
        </div>
        
    );
};
export default SignupPage;