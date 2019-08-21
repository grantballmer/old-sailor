const body = require("./main");
const closeMenus = require("./side-menus/toggleMenus");
const beerDetails = require("./beerDetails");

const overlay = document.querySelector(".beer-info-overlay");
const closeBtn = overlay.querySelector(".btn__close");

const prevBtn = overlay.querySelector(".overlay__arrow--prev");
const nextBtn = overlay.querySelector(".overlay__arrow--next");

const slideImages = document.querySelectorAll("[data-beer]");

let index; // global object to be used for navigation between beers in overlay element

// get all keys (beer names) from beerDetails object
// store in array to allow navigation between beers on overlay element
const beerNamesArr = [];

for (let beer in beerDetails) {
  beerNamesArr.push(beer);
}

overlay.addEventListener("click", e => e.stopPropagation);

function updateBeerInfo(obj) {
  // change overlay background color
  overlay.style.backgroundColor = obj.background;

  // add beer image, name, and description to overlay
  const overlayImage = overlay.querySelector(".overlay__image img");
  overlayImage.src = `${overlayImage.dataset.src}/${obj.image}`; // use element's data-src value + image file name

  overlay.querySelector(".beer__availability").textContent = `
  ${obj.lineup.time} | ${obj.lineup.title}`;
  overlay.querySelector(".beer__name").textContent = obj.name;
  overlay.querySelector(".overlay__details--desc").textContent =
    obj.description;

  // add beer attributes to overlay
  overlay.querySelector(".beer__style").textContent = obj.style;
  overlay.querySelector(".beer__alc").textContent = obj.alcohol;
  overlay.querySelector(".beer__ibu").textContent = obj.IBU;

  // display overlay
  overlay.classList.add("displayOverlay");
}

// when slide image is clicked, display full screen overlay with beer info
slideImages.forEach((image, sliderIndex) =>
  image.addEventListener("click", function(e) {
    e.stopPropagation(); // needed to stop body click event that removes 'noScroll' class
    closeMenus(); // close the beer menus, else they are still open and creates jarring closing effect when user closes out beer info overlay
    index = beerNamesArr.indexOf(image.dataset.beer); // set global variable index when image is clicked for prev/next navigation buttons
    body.classList.add("noScroll"); // remove scroll ability on body

    // get beer info from beerDetails object
    const beerObj = beerDetails[image.dataset.beer];
    updateBeerInfo(beerObj);
  })
);

// remove overlay
closeBtn.addEventListener("click", function() {
  body.classList.remove("noScroll");
  overlay.classList.remove("displayOverlay");
});

function getPrevNextBeerInfo(index) {
  // select beer name from beerNamesArr and then find beer info from beerDetails object.
  const element = beerNamesArr[index];
  const beerObj = beerDetails[element];

  updateBeerInfo(beerObj);
}

function handleNavigationClicks(direction) {
  // if prev button is clicked
  if (direction === "prev") {
    index -= 1;
    if (index < 0) {
      index = beerNamesArr.length - 1;
    }
  }
  // if next button is clicked
  else {
    index += 1;
    if (index > beerNamesArr.length - 1) {
      index = 0;
    }
  }

  getPrevNextBeerInfo(index);
}

prevBtn.addEventListener("click", () => handleNavigationClicks("prev"));
nextBtn.addEventListener("click", () => handleNavigationClicks("next"));
