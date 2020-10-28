import React from 'react';
import './SiteInfo.css';

function SiteInfo()
{
    return (
        <div class="outer-box">
            <div class="inner-box">
                <div class="modal-content">
                    <p class="info">Welcome to <span class="afont">A</span><b class="copperfont">thena: Wisdom In Your Pocket</b></p>
                    <p class="info">
                        <ul>
                            <li>Create your own "study sets" and share them with the world</li>
                            <li>Study your sets in "Flashcard Mode"</li>
                            <li>Prepare for examinations in "Quiz Mode"</li>
                            <li>And compete with your classmates in "Speed Learn Mode"</li>
                        </ul>
                    </p>
                    <p class="info">Embrance the power of the Greek goddess of wisdom everywhere you go with the mobile app: <a href="">click here to download</a></p>
                </div>
            </div>
        </div>
    );
};

export default SiteInfo;