import React from "react";
import Carousel from "react-elastic-carousel";
import Item from "./Item";
import "./SiteImages.css";

import image1 from "../img/image1.png";
import image2 from "../img/image2.png";
import image3 from "../img/image3.png";
import image4 from "../img/image4.png";



function SiteImages() {
  return (
      <Carousel className="SiteImages">
        <Item><img className="d-block w-100" alt="1" src={image1}/></Item>
        <Item><img className="d-block w-100" alt="2" src={image2}/></Item>
        <Item><img className="d-block w-100" alt="3" src={image3}/></Item>
        <Item><img className="d-block w-100" alt="4" src={image4}/></Item>
      </Carousel>
  );
};

export default SiteImages;