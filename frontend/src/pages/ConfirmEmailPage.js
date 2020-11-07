import React from 'react';

import PageTitle from '../components/PageTitle';
import ConfirmEmailBox from '../components/ConfirmEmailBox';

import './ForgotPasswordPage.css';


const ConfirmEmailPage = () =>
{

    return(
        <div class="fpp">
            <PageTitle />
            <ConfirmEmailBox />
        </div>
    );
};

export default ConfirmEmailPage;