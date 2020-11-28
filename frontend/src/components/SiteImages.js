import React from "react";
import Carousel from "react-elastic-carousel";
import Item from "./Item";
import "./SiteImages.css";

function SiteImages() {
 
  var pictures = [require("../img/Menu.png"), require("../img/NewQuiz.png")];
  var position = 0;
  var img;

  window.onload = function(){loadQuiz()};

  async function loadQuiz()
  {   
      img = document.getElementById('carousel');
      img.src = pictures[position];
  }


  const moveRight = () => {
      if (position >= pictures.length - 1) {
          position = 0;
          img.src = pictures[position];
          return;
      }
      img.src = pictures[position];
      position++;
  }

  const moveLeft = () => {
      if (position < 1) {
          position = pictures.length - 1;
          img.src = pictures[position];
          return;
      }
      img.src = pictures[position];
      position--;
  }

  return (
    <div className="container carousel-container-img align-items-center" onClick={loadQuiz}>
        <button id="left-btn" className="carousel-btn-img" onClick={moveLeft}><i class="arrow"></i></button>
        <img className="site-images-img" id="carousel" src={""} />
        <button id="right-btn" className="carousel-btn-img" onClick={moveRight}><i class="arrow"></i></button>
    </div>
  );
}

export default SiteImages;