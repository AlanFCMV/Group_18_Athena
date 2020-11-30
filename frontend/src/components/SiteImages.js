import React from "react";
import "./SiteImages.css";

function SiteImages() {
 
  var pictures = [require("../img/Menu.png"), require("../img/NewQuiz.png"), require("../img/MyQuizzes.png"), require("../img/GlobalSearch.png"), require("../img/ViewGlobalQuiz.png"), require("../img/ViewUserPage.png")];
  var position = 0;
  var img;

  window.onload = function(){loadImagesOnStart()};

  async function loadImagesOnStart()
  {   
      img = document.getElementById('carousel');
      img.src = pictures[position];
  }

  function loadImages()
  {
    img.src = pictures[position];
    console.log(position);
  }

  const moveRight = () => {
      if (position >= pictures.length - 1) {
          position = 0;
          img.src = pictures[position];
          console.log(position);
          return;
      }
      img.src = pictures[position];
      console.log(position);
      position++;
  }

  const moveLeft = () => {
      if (position < 1) {
          position = pictures.length - 1;
          img.src = pictures[position];
          console.log(position);
          return;
      }
      img.src = pictures[position];
      console.log(position);
      position--;
  }

  return (
    <div className="container carousel-container-img align-items-center" onClick={loadImages}>
        <button id="left-btn" className="carousel-btn-img" onClick={moveLeft}><i class="arrow"></i></button>
        <img className="site-images-img" id="carousel" src={""} />
        <button id="right-btn" className="carousel-btn-img" onClick={moveRight}><i class="arrow"></i></button>
    </div>
  );
}

export default SiteImages;
