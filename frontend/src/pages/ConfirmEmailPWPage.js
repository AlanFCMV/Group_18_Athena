import React from 'react';

import PageTitle from '../components/PageTitle';
import ConfirmEmailPWBox from '../components/ConfirmEmailPWBox';

import './ConfirmEmailPWPage.css';


const ConfirmEmailPWPage = () =>
{

    return(
        <div class="fpp">
            <PageTitle />
            <ConfirmEmailPWBox />
        </div>
    );
};

export default ConfirmEmailPWPage;