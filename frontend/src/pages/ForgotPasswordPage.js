import React from 'react';

import PageTitle from '../components/PageTitle';
import ForgotPasswordBox from '../components/ForgotPasswordBox';

import './ForgotPasswordPage.css';


const ForgotPasswordPage = () =>
{

    return(
        <div class="fpp">
            <PageTitle />
            <ForgotPasswordBox />
        </div>
    );
};

export default ForgotPasswordPage;