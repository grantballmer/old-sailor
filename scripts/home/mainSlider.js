const slider = $(".slider");

const sliderContainer = document.querySelector(".slider-container") || "";

// display slider container on load to prevent slider momentarily flashing on home page load
if (sliderContainer) {
  sliderContainer.style.display = "flex";
}

const slides = sliderContainer
  ? sliderContainer.querySelectorAll(".slide")
  : "";

slider.slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  centerMode: true,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 812,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 550,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true
      }
    }
  ]
});

// On before slide change
$(".slider").on("beforeChange", function(
  event,
  slick,
  currentSlide,
  nextSlide
) {
  const color = slides[nextSlide].dataset.color;
  sliderContainer.style.backgroundColor = color;
});

// prev slide
$(".slider-arrow__prev").on("click", function() {
  $(".slider").slick("slickPrev");
});

// next slide
$(".slider-arrow__next").on("click", function() {
  $(".slider").slick("slickNext");
});

//function to not display partial slides on side of slider when using centerMode

// function setSlideVisibility() {
//   //Find the visible slides i.e. where aria-hidden="false"
//   var visibleSlides = $('.slick-slide[aria-hidden="false"]');
//   //Make sure all of the visible slides have an opacity of 1
//   $(visibleSlides).each(function() {
//     $(this).css("opacity", 1);
//   });
//   //Set the opacity of the first and last partial slides.
//   $(visibleSlides)
//     .first()
//     .prev()
//     .css("opacity", 0);
//   $(visibleSlides)
//     .last()
//     .next()
//     .css("opacity", 0);
// }

// $(setSlideVisibility());

// $(".slider").on("beforeChange", function() {
//   $(".slick-slide").each(function() {
//     $(this).css("opacity", 1);
//   });
// });

// $(".slider").on("afterChange", function() {
//   setSlideVisibility();
// });
