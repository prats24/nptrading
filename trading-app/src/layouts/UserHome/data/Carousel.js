// import React, { Component } from 'react';
// import Slider from 'react-slick';
// import CarouselImage from '../../../assets/images/carousel.png'

// class Carousel extends Component {
//   render() {
//     const settings = {
//       dots: true,
//       infinite: true,
//       speed: 500,
//       slidesToShow: 3,
//       slidesToScroll: 1,
//       autoplay: true,
//       autoplaySpeed: 2000,
//       responsive: [
//         {
//           breakpoint: 1024,
//           settings: {
//             slidesToShow: 2,
//             slidesToScroll: 1,
//             infinite: true,
//             dots: true,
//           },
//         },
//         {
//           breakpoint: 768,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1,
//           },
//         },
//       ],
//     };

//     return (
//       <Slider {...settings}>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//         <div>
//           <img width={600} height={400} src={CarouselImage} alt="" />
//         </div>
//       </Slider>
//     );
//   }
// }

// export default Carousel;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import CarouselImage from '../../../assets/images/carousel.png'
import CarouselImage1 from '../../../assets/images/carousel1.png'

export default function SimpleSlider() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      backgrounColor:"black",
    };
    return (
      <Slider {...settings} style={{backgrounColor:"black"}}>
        <div>
          <h3><img style={{width: "100%", padding: "0 10px"}} src={CarouselImage}/></h3>
        </div>
        <div>
          <h3><img style={{width: "100%", padding: "0 10px"}} src={CarouselImage1}/></h3>
        </div>
        <div>
          <h3><img style={{width: "100%", padding: "0 10px"}} src={CarouselImage}/></h3>
        </div>
        <div>
          <h3><img style={{width: "100%", padding: "0 10px"}} src={CarouselImage}/></h3>
        </div>
        <div>
          <h3><img style={{width: "100%", padding: "0 10px"}} src={CarouselImage}/></h3>
        </div>
        <div>
          <h3><img style={{width: "100%", padding: "0 10px"}} src={CarouselImage}/></h3>
        </div>
      </Slider>
    );
  }
// export default SimpleSlider;

