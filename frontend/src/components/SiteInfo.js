import React from 'react';
import './SiteInfo.css';

function SiteInfo()
{
    return (
        <div class="outer-box">
            <div class="inner-box">
                <div class="modal-content info">
                    <p class="text-center">Welcome to Athena: Wisdom In Your Pocket</p>
                    <p>
                        <ul>
                            <li>Create your own quizzes and share them with the world</li>
                            <li>Study your sets in "My Quizzes"</li>
                            <li>Find other quizzes in "Global Search"</li>
                            <li>"Like" quizzes you enjoy to easily find them later</li>
                            <li>"Follow" other users to find the quizzes they've made</li>
                            <li>Study in even more ways with the Athena Mobile App</li>
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SiteInfo;