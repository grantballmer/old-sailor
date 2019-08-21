const iconContainer = document.querySelector(".nav-icons");
const navIcons = iconContainer.querySelectorAll(".nav-icon");
const menus = document.querySelectorAll(".menu");

// const body = document.querySelector("body");
const body = require("../main");

function closeMenus() {
  menus.forEach(menu => menu.classList.remove("displayMenu"));
}

// remove display class from all menu elements
function removeMenuDisplay() {
  body.classList.remove("noScroll");
  iconContainer.classList.remove("changeColor");
  closeMenus();
}

function addMenuDisplay(element) {
  body.classList.add("noScroll");
  element.classList.add("displayMenu");
  iconContainer.classList.add("changeColor");
}

// load beer can images
function loadImages(element) {
  const images = element.querySelectorAll(".menu__slide--image img");
  images.forEach(image => (image.src = image.dataset.src || image.src));
}

// add click event to icons and add class to correct menu to be display
navIcons.forEach((icon, index) =>
  icon.addEventListener("click", function(e) {
    e.stopPropagation(); // stop body event listener from firing
    const targetMenu = menus.item(index); // variable to store which menu is being targeted

    // check to see if menu element already has display menu class and store boolean
    // use boolean later to see if displayMenu class should be added back
    const hasClass = targetMenu.classList.contains("displayMenu");
    removeMenuDisplay();

    // if menu element didn't already have display menu class, then add it to element
    if (!hasClass) {
      addMenuDisplay(targetMenu);
    }

    //load beer can images if beer menu is displayed
    if (targetMenu.dataset.menu === "beer") {
      loadImages(targetMenu);
    }
  })
);

// prevent closing menu element when click happens inside menu element
menus.forEach(menu =>
  menu.addEventListener("click", function(e) {
    e.stopPropagation();
  })
);

// if body is clicked remove class from all menu elements
body.addEventListener("click", removeMenuDisplay);

module.exports = closeMenus;

// function getPrevNextBeerInfo(index) {
//   // select beer name from beerNamesArr and then find beer info from beerDetails object.
//   const element = beerNamesArr[index];
//   const beerObj = beerDetails[element];

//   updateBeerInfo(beerObj);
// }

// function handleNavigationClicks(direction) {
//   const beer = overlay.dataset.info;

//   // if prev button is clicked
//   if (direction === "prev") {
//     index -= 1;
//     if (index < 0) {
//       index = beerNamesArr.length - 1;
//     }
//   }
//   // if next button is clicked
//   else {
//     index += 1;
//     if (index > beerNamesArr.length - 1) {
//       index = 0;
//     }
//   }

//   getPrevNextBeerInfo(index);
// }

// prevBtn.addEventListener("click", () => handleNavigationClicks("prev"));

// nextBtn.addEventListener("click", () => handleNavigationClicks("next"));
