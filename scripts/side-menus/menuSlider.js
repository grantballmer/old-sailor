const menuSlider = $(".menu-slider");

// initialize beer menu slider
menuSlider.slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  infinite: true,
  dots: true,
  arrows: false
});

// prev slide
$(".menu-prev").on("click", function() {
  $(".menu-slider").slick("slickPrev");
});

// next slide
$(".menu-next").on("click", function() {
  $(".menu-slider").slick("slickNext");
});
