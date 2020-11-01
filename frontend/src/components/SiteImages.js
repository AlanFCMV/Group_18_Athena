import React from 'react';
import './SiteImages.css';

function SiteImages()
{
    return (
        <div class="outer-box2">
            <div class="inner-box2">
                <div class="modal-content">

                    {/* Carousel*/}
                    <div class="carousel slide" id="myCarousel" data-ride="carousel">

                        {/* Slide Indicators*/}
                        <ol class="carousel-indicators">
                            <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                            <li data-target="#myCarousel" data-slide-to="1"></li>
                            <li data-target="#myCarousel" data-slide-to="2"></li>
                            <li data-target="#myCarousel" data-slide-to="3"></li>
                        </ol>

                        {/* Slides */}
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img class="d-block img-fluid" src={require("../img/image1.png")} />
                            </div>

                            <div class="carousel-item">
                                <img class="d-block img-fluid" src={require("../img/image2.png")} />
                            </div>

                            <div class="carousel-item">
                                <img class="d-block img-fluid" src={require("../img/image3.png")} />
                            </div>

                            <div class="carousel-item">
                                <img class="d-block img-fluid" src={require("../img/image4.png")} />
                            </div>
                        </div>

                        {/* Left and Right Arrows*/}
                        <a class="carousel-control-prev" href="#myCarousel" data-slide="prev">
                            <span class="carousel-control-prev-icon"></span>
                        </a>
                        <a class="carousel-control-next" href="#myCarousel" data-slide="next">
                            <span class="carousel-control-next-icon"></span>
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteImages;