import React from 'react';
import './SiteImages.css';

function SiteImages()
{
    return (
        <div class="outer-box2">
            <div class="inner-box2">
                <div class="modal-content">

                    {/* Carousel*/}
                    <div id="myCarousel" class="carousel slide" data-ride="carousel">

                        {/* Slide Indicators*/}
                        <ol class="carousel-indicators">
                            <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                            <li data-target="#myCarousel" data-slide-to="1"></li>
                            <li data-target="#myCarousel" data-slide-to="2"></li>
                            <li data-target="#myCarousel" data-slide-to="3"></li>
                        </ol>

                        {/* Slides */}
                        <div class="carousel-inner">
                            <div class="item active">
                                <img src="../img/image1.png" alt="One" />
                            </div>

                            <div class="item">
                                <img src="../img/image2.png" alt="Two" />
                            </div>

                            <div class="item">
                                <img src="../img/image3.png" alt="Three" />
                            </div>

                            <div class="item">
                                <img src="../img/image4.png" alt="Four" />
                            </div>
                        </div>

                        {/* Left and Right Arrows*/}
                        <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                            <span class="glyphicon glyphicon-chevron-left"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="right carousel-control" href="#myCarousel" data-slide="next">
                            <span class="glyphicon glyphicon-chevron-right"></span>
                            <span class="sr-only">Next</span>
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteImages;