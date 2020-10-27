import React from 'react';
import './PageTitle.css';

function PageTitle()
{
   return(
        <div>
            <img class="title-image" alt="ATHENA" src={require("../img/AthenaTextLogo.png")}/>
        </div>
   );
};  

export default PageTitle;
