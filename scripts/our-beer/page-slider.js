$(".page-slider").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  dots: true,
  arrows: false
});

// prev slide
$(".page-slider-prev").on("click", function() {
  $(".page-slider").slick("slickPrev");
});

// next slide
$(".page-slider-next").on("click", function() {
  $(".page-slider").slick("slickNext");
});
