(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// const locations = {
//   bar145: {
//     lat: 41.7025889,
//     lng: -83.6612744
//   },
//   bierStube: {
//     lat: 41.703042,
//     lng: -83.6604747
//   },
//   tripleCrown: {
//     lat: 41.6608024,
//     lng: -83.6843061
//   },
//   shawns: {
//     lat: 41.5953587,
//     lng: -83.6489258
//   },
//   sidelines: {
//     lat: 41.7624162,
//     lng: -83.6278397
//   },
//   barLouieAA: {
//     lat: 42.279582,
//     lng: -83.7460487
//   },
//   goodTimeCharlies: {
//     lat: 42.2748004,
//     lng: -83.7370198
//   },
//   graniteCity: {
//     lat: 42.4239339,
//     lng: -83.4376082
//   },
//   floods: {
//     lat: 42.3343807,
//     lng: -83.0424662
//   }
// };

const locations = [
  {
    name: "Bar 145",
    lat: 41.7025889,
    lng: -83.6612744
  },
  {
    name: "Bier Stube",
    lat: 41.703042,
    lng: -83.6604747
  },
  {
    name: "Triple Crown Lounge",
    lat: 41.6608024,
    lng: -83.6843061
  },
  {
    name: "Shawn's Irish Tavern",
    lat: 41.5953587,
    lng: -83.6489258
  },
  {
    name: "Sidelines Sports Eatery",
    lat: 41.7624162,
    lng: -83.6278397
  },
  {
    name: "Bar Louie - Ann Arbor",
    lat: 42.279582,
    lng: -83.7460487
  },
  {
    name: "Good Time Charley's",
    lat: 42.2748004,
    lng: -83.7370198
  },
  {
    name: "Granite City",
    lat: 42.4239339,
    lng: -83.4376082
  },
  {
    name: "floods",
    lat: 42.3343807,
    lng: -83.0424662
  }
];

// const locations = {
//   bar145: {
//     coords: [41.7025889, -83.6612744]
//   },
//   bierStube: {
//     coords: [41.703042, -83.6604747]
//   },
//   tripleCrown: {
//     coords: [41.6608024, -83.6843061]
//   },
//   shawns: {
//     coords: [41.5953587, -83.6489258]
//   },
//   sidelines: {
//     coords: [41.7624162, -83.6278397]
//   },
//   barLouieAA: {
//     coords: [42.279582, -83.7460487]
//   },
//   goodTimeCharlies: {
//     coords: [42.2748004, -83.7370198]
//   },
//   graniteCity: {
//     coords: [42.4239339, -83.4376082]
//   },
//   floods: {
//     coords: [42.3343807, -83.0424662]
//   }
// };

module.exports = locations;

},{}],2:[function(require,module,exports){
const locations = require("./locations");
let markers = [];

if (google) {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.5, lng: -98.35 },
    zoom: 4
  });

  const form = document.querySelector(".beer-search form");
  const service = new google.maps.DistanceMatrixService();

  function distanceMatrix(data, googleObjects) {
    // call google distance matrix service, passing in the zip code submitted by user as oriign and the locations of bars as destinations
    service.getDistanceMatrix(
      {
        origins: data.origin,
        destinations: googleObjects,
        travelMode: "DRIVING",
        unitSystem: google.maps.UnitSystem.IMPERIAL
      },
      callback
    );

    function callback(response, status) {
      if (status === "OK") {
        const { elements } = response.rows[0]; // grab response elements which includes the bar locations and their distances from submitted input
        let zoom;

        // reset markers array to clear any previous markers currently being display on map
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];

        //create marker and add to markers array
        function addMarker(locationData) {
          const marker = new google.maps.Marker({
            position: { lat: locationData.lat, lng: locationData.lng },
            map: map
          });

          const contentString = `
            <div>
              <h1>${locationData.name}</h1>
            </div>
          `;

          const infoWindow = new google.maps.InfoWindow({
            content: contentString
          });

          marker.addListener("mouseover", function() {
            infoWindow.open(map, marker);
          });

          marker.addListener("mouseout", function() {
            infoWindow.close(map, marker);
          });

          marker.addListener("click", function() {
            infoWindow.open(map, marker);
          });

          markers.push(marker);
        }

        // loop through elements and add marker to location this is within the distance the user selected on the form
        elements.forEach((location, index) => {
          const distanceNum = Number(location.distance.text.split(" ")[0]);

          if (distanceNum < data.distance) {
            const locationData = locations[index];
            addMarker(locationData);
          }
        });

        // use 1st returned location to determine new map center
        const latLng = new google.maps.LatLng(
          markers[0].getPosition().lat(),
          markers[0].getPosition().lng()
        );
        map.setCenter(latLng);

        // set zoom on map to display markers
        if (data.distance === 100) {
          zoom = 8;
        } else if (data.distance === 25) {
          zoom = 10;
        } else {
          zoom = 12;
        }

        map.setZoom(zoom);
      }
    }
  }

  function findDistances(data) {
    function makeIntoGoogleObj(item) {
      return new google.maps.LatLng(item.lat, item.lng);
    }
    // transform all location lat, lng into google objects
    const googleObjects = locations.map(place => makeIntoGoogleObj(place));

    distanceMatrix(data, googleObjects);
  }

  // when form is submitted
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const parameters = form.querySelectorAll("[data-input]");
    const distance = Number(parameters[0].textContent.split(" ")[0]); // return only integer from the dropdown list content
    const data = {
      origin: [form.querySelector("input[type=search]").value],
      distance: distance,
      type: parameters[1].textContent,
      beer: parameters[2].textContent
    };

    findDistances(data);
  });
}

// const apiKey = "AIzaSyAgsXfhN2Desf5gsa9mrT6u_U22xDuZsdE";

// const service = new google.maps.DistanceMatrixService();
// service.getDistanceMatrix(
//   {
//     origins: ["43617"],
//     destinations: ["New York City", new google.maps.LatLng(42.33, -83.04)],
//     travelMode: "DRIVING",
//     unitSystem: google.maps.UnitSystem.IMPERIAL
//   },
//   callback
// );

// function callback(response, status) {
//   console.log(status, response.rows[0].elements);
// }

// map = new google.maps.Map(document.getElementById("map"), {
//   center: { lat: 39.5, lng: -98.35 },
//   zoom: 4
// });
// const numKeys = Object.keys(locations).length;

// let counter = 0;
// let requestString = "";

// for (let bar in locations) {
//   counter += 1;
//   const barCoords = `${locations[bar].lat}, ${locations[bar].lng}`;

//   counter === numKeys
//     ? (requestString += barCoords)
//     : (requestString += `${barCoords}| `);
// }

// console.log(requestString);

// // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=44311&destinations=${requestString}&key=apiKey`;

// fetch(
//   "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyAgsXfhN2Desf5gsa9mrT6u_U22xDuZsdE"
// )
//   .then(res => res.json())
//   .then(response => console.log(response));

},{"./locations":1}],3:[function(require,module,exports){
const beers = {
  haze: {
    name: "Haze Wizard",
    image: "haze-wizard.png",
    background: "#1c365a",
    lineup: {
      time: "Year-Round",
      title: "Our Core Lineup"
    },
    description: `Haze Wizard is unique in that New England IPAs are hazy in appearance, high in hops and low in bitterness. 
    It has a soothing flavor that makes you want another. Haze Wizard is one for the ages and does not disappoint.`,
    style: "New England Style IPA",
    alcohol: "7.5",
    IBU: "55"
  },
  mango: {
    name: "Mango Smash",
    image: "mango-smash.png",
    background: "#E8BF06",
    lineup: {
      time: "Year-Round",
      title: "Our Core Lineup"
    },
    description: `A delicious and easy to drink Indian Pale Ale. Plenty of flavor with mango, pineapple and stone fruit and a slightly bitter finish.`,
    style: "IPA",
    alcohol: "6.9",
    IBU: "70"
  },
  royal: {
    name: "Royal Blood",
    image: "royal-blood.png",
    background: "#6F4A9F",
    lineup: {
      time: "Year-Round",
      title: "Our Core Lineup"
    },
    description: `Starting off as a summer seasonal beer, Royal Blood ended up as our best-selling Taproom beer. Now available in cans, it is refreshing and has a unique flavor that is repeatable. Royal Blood has a big orange aroma and a sweet finish.`,
    style: "Blood Orange Wit",
    alcohol: "5.5",
    IBU: "25"
  },
  gold: {
    name: "Texas Gold",
    image: "texas-gold.png",
    background: "#982221",
    lineup: {
      time: "Year-Round",
      title: "Our Core Lineup"
    },
    description: `It is the perfect beer for outdoor activities in the hot Texas sun. It’s considered a light craft beer. 
    A blonde ale brewed with tangerine peel and German Melon hops. It has a light body and a slightly sweet finish from oat flakes and toasted wheat.`,
    style: "Kream Ale",
    alcohol: "4.7",
    IBU: "14"
  },
  gpa: {
    name: "GPA",
    image: "gpa.png",
    background: "#EFD300",
    lineup: {
      time: "Year-Round",
      title: "Our Core Lineup"
    },
    description: `It is an “above average” beer that is loved by brewers and craft beer connoisseurs. 
    Citrus aroma and flavor with a peppery finish and is a craft beer lovers delight.`,
    style: "German Pale Ale",
    alcohol: "5.2",
    IBU: "52"
  },
  xmas: {
    name: "Texas Xmas",
    image: "texas-xmas.png",
    background: "#DA1E2A",
    lineup: {
      time: "Year-Round",
      title: "Our Core Lineup"
    },
    description: `Feliz Navidad! This Tex-Mex brew blends the best flavors both sides of the border into the perfect seasonal spirit, giving you our mexican chocolate imperial stout. 
    This Christmas flavor is only available in December.`,
    style: "Stout",
    alcohol: "8.3",
    IBU: "25"
  },
  summer: {
    name: "Summer Love",
    image: "summer-love.png",
    background: "#F26455",
    lineup: {
      time: "Limited Release",
      title: "Seasonal"
    },
    description: `Enjoy the easy days of summer with this refreshing and aromatic golden ale. Enticing earthy and citrusy hop aromas give way to flavors of lemon and pine.`,
    style: "Golden Ale",
    alcohol: "5.2",
    IBU: "40"
  },
  california: {
    name: "California Lager",
    image: "california-lager.png",
    background: "#4D1F19",
    lineup: {
      time: "Limited Release",
      title: "Seasonal"
    },
    description: `Made in San Francisco with two-row California barley, Cluster hops (the premier hop in 19th-century California), and our own lager yeast, this all-malt brew is kräusened and lagered in our cellars.`,
    style: "2-Row Pale",
    alcohol: "4.9",
    IBU: "19"
  },
  santo: {
    name: "Santo",
    image: "santo.png",
    background: "#F62E39",
    lineup: {
      time: "Limited Release",
      title: "Seasonal"
    },
    description: `Santo is a black Kölsch, which technically doesn’t exist as a style, but this is as close as we can come to describing it. 
    Essentially it is brewed using a Kölsch recipe with the addition of Munich and black malt. 
    It is light bodied and floral yet with a distinct dark malt flavor. Our goal was to create a dark yet refreshing beer that would pair perfectly with a plate of enchiladas.`,
    style: "Kölsch",
    alcohol: "4.9",
    IBU: "17"
  },
  lawnmower: {
    name: "Fancy Lawnmower",
    image: "lawnmower.png",
    background: "#93C52E",
    lineup: {
      time: "Limited Release",
      title: "Seasonal"
    },
    description: `A true German-style Kölsch. Originally brewed in Cologne, this beer is crisp and refreshing, yet has a sweet malty body that is balanced by a complex, citrus hop character. 
    Multiple additions of German Hallertauer hops are used to achieve this delicate flavor.`,
    style: "Kölsch",
    alcohol: "4.9",
    IBU: "20"
  },
  devout: {
    name: "Devout Crème Brulee",
    image: "devout.png",
    background: "#31A7A1",
    lineup: {
      time: "Limited Release",
      title: "Seasonal"
    },
    description: `This is a beer devoted to our calling - divine taste and true to tradition.`,
    style: "Kölsch",
    alcohol: "8.3",
    IBU: "25"
  },
  bavarian: {
    name: "Crazy Bavarian",
    image: "bavarian.png",
    background: "#D87A02",
    lineup: {
      time: "Limited Release",
      title: "Seasonal"
    },
    description: `Available September and October.`,
    style: "Oktoberfest",
    alcohol: "5.8",
    IBU: "25"
  }
};

module.exports = beers;

},{}],4:[function(require,module,exports){
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

},{"./beerDetails":3,"./main":9,"./side-menus/toggleMenus":13}],5:[function(require,module,exports){
// const instagramPost = document.querySelector(".card__instagram");

// window
//   .fetch(
//     "https://api.instagram.com/oembed/?url=https://www.instagram.com/p/Bv__9T0hoIV/?utm_source=ig_embed"
//   )
//   .then(response => response.json())
//   .then(res => {
//     const markUp = `
//       <div class="card__tag">Instagram</div>
//       <div class="card__image" style="background-image: url('${
//         res.thumbnail_url
//       }')">

//       </div>
//       <div class="card__body">
//         <p>${res.title}</p>
//       </div>
//       <div class="card__footer"></div>
//     `;

//     instagramPost.insertAdjacentHTML("afterbegin", markUp);
//   });

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
// const Embedo = require("embedo");

// window.onload = function() {
//   console.log("start");
//   var embedo = new Embedo({
//     facebook: {
//       version: "v2.10",
//       appId: "1191864160977852",
//       xfbml: true
//     },
//     twitter: true,
//     instagram: true
//   });

//   // Loads tweet
//   embedo
//     .load(
//       document.getElementById("embedo-twitter"),
//       "https://twitter.com/COOPAleWorks/status/1118559895165571072"
//     )
//     .done(function() {
//       console.log("Tweet Loaded. [hide loader if/any]");
//     });

//   // // Loads twitter timeline grid
//   // embedo.load(
//   //   document.getElementById("embedo-twitter-grid"),
//   //   "https://twitter.com/TwitterDev/timelines/539487832448843776",
//   //   {
//   //     widget_type: "grid"
//   //   }
//   // );

//   // // Loads twitter timeline
//   // embedo.load(
//   //   document.getElementById("embedo-twitter-timeline"),
//   //   "https://twitter.com/COOPAleWorks",
//   //   {
//   //     height: 500
//   //   }
//   // );

//   // embedo.load(
//   //   document.getElementById("embedo-gist"),
//   //   "https://gist.github.com/brandonb927/4149074.js",
//   //   {
//   //     frameborder: 0
//   //   }
//   // );

//   // embedo.load(
//   //   document.getElementById("embedo-codepen"),
//   //   "https:////codepen.io/PavelDoGreat/embed/zdWzEL/?height=265&theme-id=0&default-tab=js,result&embed-version=2"
//   // );

//   // // Multiple URLs
//   // embedo.load(
//   //   document.getElementById("embedo-multiple"),
//   //   [
//   //     "https://www.instagram.com/p/BX3fMnRjHpZ",
//   //     "https://www.instagram.com/p/BX3ejdJHmkD",
//   //     "https://www.instagram.com/p/BX3VEDqFvmg"
//   //   ],
//   //   {
//   //     hidecaption: false
//   //   }
//   // );

//   // // Loads facebook post
//   // embedo
//   //   .load(
//   //     document.getElementById("embedo-facebook"),
//   //     "https://www.facebook.com/9gag/posts/10156278718151840",
//   //     {}
//   //   )
//   //   .done(function() {
//   //     console.log("Facebook Loaded. [hide loader if/any]");
//   //   })
//   //   .fail(function(err) {
//   //     console.warn("Facebook embed issue:", err);
//   //   });

//   // Loads instagram photo
//   embedo.load(
//     document.getElementById("embedo-instagram"),
//     "https://www.instagram.com/p/BwXOa-8h0E3/",
//     {
//       hidecaption: false
//     }
//   );

//   // Test Element Watch Events
//   embedo.on("watch", function(result) {
//     console.log("Embedo watch", result);
//   });

//   embedo.on("refresh", function(request, data) {
//     console.log("Embedo refresh", request, data);
//   });

//   embedo.on("destroy", function() {
//     console.log("Embedo destroy");
//   });

//   embedo.on("error", function(error) {
//     console.error("Embedo error", error);
//   });

//   console.log("finished");
// };

},{}],8:[function(require,module,exports){
// insert nav
navbarScript = Handlebars.templates.navbar();
document.querySelector("header").insertAdjacentHTML("afterbegin", navbarScript);

//insert menus
menusSript = Handlebars.templates.menus();
document.querySelector(".menus").insertAdjacentHTML("afterbegin", menusSript);

//insert beer info overlay
beerInfoOverlaySript = Handlebars.templates.beerInfoOverlay();
document
  .querySelector(".beer-info-overlay")
  .insertAdjacentHTML("afterbegin", beerInfoOverlaySript);

//insert footer
footerSript = Handlebars.templates.footer();
document.querySelector("footer").insertAdjacentHTML("afterbegin", footerSript);

},{}],9:[function(require,module,exports){
$(document).ready(function() {
  // Insert handlebars templates
  const templatesFile = require("../templates/allTemplates");
  const insertTemplates = require("./insertTemplates");

  // global body variable
  const body = document.querySelector("body");
  module.exports = body;

  // side nav, when 3 bars menu is clicked
  const toggleSideNav = require("./sideNav");

  // beers, events, and taproom menus
  const toggleMenus = require("./side-menus/toggleMenus");
  const menuSlider = require("./side-menus/menuSlider");
  const menuDropdown = require("./menuDropdown");

  // main landing page slider
  const mainSlider = require("./home/mainSlider");

  const beerInfoOverlay = require("./beerInfoOverlay");

  const socialMedia = require("./home/socialMediaFeed");

  const getInstagram = require("./home/getInstagramPost");

  // pages
  const pageSlider = require("./our-beer/page-slider");

  const map = require("./beer-locator/map");
});

},{"../templates/allTemplates":15,"./beer-locator/map":2,"./beerInfoOverlay":4,"./home/getInstagramPost":5,"./home/mainSlider":6,"./home/socialMediaFeed":7,"./insertTemplates":8,"./menuDropdown":10,"./our-beer/page-slider":11,"./side-menus/menuSlider":12,"./side-menus/toggleMenus":13,"./sideNav":14}],10:[function(require,module,exports){
const dropdownMenus = document.querySelectorAll(".dropdown");
let currentDropdown; // keep track of which dropdown is currently being targeted

const dropdownRegion = document.querySelectorAll(".dropdown__content--region");
const events = document.querySelectorAll(".event");

function toggleDropdown() {
  currentDropdown.classList.toggle("activeDropdown");
  const dropdownContent = currentDropdown.querySelector(".dropdown__content");
  dropdownContent.classList.toggle("displayDropdownMenu");
}

function filterEvents(selected) {
  events.forEach(item => {
    // if all has been selected then remove classes that hide event elements from all elements
    if (selected === "all") {
      item.classList.remove("zeroHeight", "positionAbs");
      return;
    }

    // if event not in selected region scale event to 0
    // Then position absolute so that it doesn't take up space
    if (item.dataset.region !== selected) {
      item.classList.add("zeroHeight");
      setTimeout(function() {
        item.classList.add("positionAbs");
      }, 300);
    } else {
      // remove classes if event is in selected region.
      item.classList.remove("zeroHeight", "positionAbs");
    }
  });
}

dropdownMenus.forEach(dropdown =>
  dropdown.addEventListener("click", function() {
    currentDropdown = this;
    toggleDropdown();
  })
);

dropdownRegion.forEach(region =>
  region.addEventListener("click", function(e) {
    e.stopPropagation();
    toggleDropdown();
    // set main dropdown text equal to the text from selected dropdown item
    // then set selected dropdown item text to the text of the main dropdown text that was stored in variable tempText
    const dropdownText = currentDropdown.querySelector("h4");
    const tempText = dropdownText.textContent;
    dropdownText.textContent = e.target.textContent;
    e.target.textContent = tempText;

    // filter events by selected region
    const selectedRegion = dropdownText.textContent.toLowerCase();
    filterEvents(selectedRegion);
  })
);

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../main":9}],14:[function(require,module,exports){
const navMenu = document.querySelectorAll(".nav-menu");
const sideNav = document.querySelector(".side-nav");
const exit = sideNav.querySelector(".fa-times");

const body = require("./main");

function toggleSideNav(e) {
  e.stopPropagation(); // need to stopPropagation because of toggle menus script where clicking on body removes noScroll class
  sideNav.classList.toggle("displaySideNav");
}

// manually add and remove no scroll class on body
// otherwise if just use toggle, when clicking on sideNav overlay, the class will be removed due to toggle menus script
navMenu.forEach(menu =>
  menu.addEventListener("click", function(e) {
    body.classList.add("noScroll");
    toggleSideNav(e);
  })
);

exit.addEventListener("click", function(e) {
  body.classList.remove("noScroll");
  toggleSideNav(e);
});

},{"./main":9}],15:[function(require,module,exports){
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['footer'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"social-media\">\r\n  <div class=\"social-media__box\">\r\n    <i class=\"fab fa-instagram\"></i>\r\n  </div>\r\n  <div class=\"social-media__box\">\r\n    <i class=\"fab fa-facebook-f\"></i>\r\n  </div>\r\n  <div class=\"social-media__box\">\r\n    <i class=\"fab fa-twitter\"></i>\r\n  </div>\r\n  <div class=\"social-media__box\">\r\n    <i class=\"fab fa-youtube\"></i>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"footer-center\">\r\n  <div class=\"footer-center__title\">\r\n    <h2>The Old Sailor</h2>\r\n    <h3>Ale Works</h3>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"nav-menu\">\r\n  <p>Menu</p>\r\n  <div class=\"nav-menu__bars\">\r\n    <span></span>\r\n    <span></span>\r\n    <span></span>\r\n  </div>\r\n</div>";
},"useData":true});
templates['menus'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- menu navs that slide in from left-side of screen when user clicks on left-side icons -->\r\n\r\n<div class=\"menu beer-menu beer\" data-menu=\"beer\">\r\n  <div class=\"menu__top-border\"></div>\r\n  <h2>Our Beer</h2>\r\n  <div class=\"arrows\">\r\n    <i class=\"fas fa-chevron-left menu-prev prev\"></i>\r\n    <i class=\"fas fa-chevron-right menu-next next\"></i>\r\n  </div>\r\n  <div class=\"menu-slider\">\r\n    <div class=\"menu__slide\">\r\n      <div class=\"menu__slide--header\">\r\n        <h4>Year-Round</h4>\r\n        <h3>Our Core Lineup</h3>\r\n      </div>\r\n      <div class=\"menu__slide--beers\">\r\n        <div class=\"menu__slide--image\" data-beer=\"haze\">\r\n          <img src=\"/old-sailor/assets/images/haze-wizard.png\" alt=\"haze wizard can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"gpa\">\r\n          <img src=\"/old-sailor/assets/images/gpa.png\" alt=\"gpa can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"royal\">\r\n          <img src=\"/old-sailor/assets/images/royal-blood.png\" alt=\"royal blood can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"devout\">\r\n          <img data-src=\"/old-sailor/assets/images/devout.png\" alt=\"devout can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"gold\">\r\n          <img src=\"/old-sailor/assets/images/texas-gold.png\" alt=\"texas gold can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"mango\">\r\n          <img src=\"/old-sailor/assets/images/mango-smash.png\" alt=\"mango smash can\" />\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"menu__slide\">\r\n      <div class=\"menu__slide--header\">\r\n        <h4>Limited Release</h4>\r\n        <h3>Seasonal</h3>\r\n      </div>\r\n      <div class=\"menu__slide--beers\">\r\n        <div class=\"menu__slide--image\" data-beer=\"summer\">\r\n          <img data-src=\"/old-sailor/assets/images/summer-love.png\" alt=\"summer love can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"california\">\r\n          <img data-src=\"/old-sailor/assets/images/california-lager.png\" alt=\"california lager can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"santo\">\r\n          <img data-src=\"/old-sailor/assets/images/santo.png\" alt=\"santo can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"lawnmower\">\r\n          <img data-src=\"/old-sailor/assets/images/lawnmower.png\" alt=\"saint arnold can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"bavarian\">\r\n          <img src=\"/old-sailor/assets/images/bavarian.png\" alt=\"crazy bavarian can\" />\r\n        </div>\r\n\r\n        <div class=\"menu__slide--image\" data-beer=\"xmas\">\r\n          <img data-src=\"/old-sailor/assets/images/texas-xmas.png\" alt=\"texas xmas can\" />\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<!-- Events Menu -->\r\n<div class=\"menu events-menu\" data-menu=\"events\">\r\n  <div class=\"menu__top-border\"></div>\r\n\r\n  <h2>Upcoming Events</h2>\r\n\r\n  <h3 class=\"menu__header\">Region</h3>\r\n\r\n  <div class=\"dropdown\">\r\n    <h4>All</h4>\r\n    <img src=\"/old-sailor/assets/icons/arrow-down.svg\" alt=\"arrow down\" />\r\n    <div class=\"dropdown__content\">\r\n      <h5 class=\"dropdown__content--region\">Dallas/Ft Worth</h5>\r\n      <h5 class=\"dropdown__content--region\">Oklahoma City</h5>\r\n      <h5 class=\"dropdown__content--region\">Tulsa</h5>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"event\" data-region=\"oklahoma city\">\r\n    <h2>Apr 24</h2>\r\n    <h3>Frida's April Flowers</h3>\r\n    <p>\r\n      Join us for a Paint & Pint Night led by our in-house artist Jessica\r\n      Legako, with a painting inspired by Mexican artist Frida Kahlo.\r\n    </p>\r\n    <h4>The Old Sailor Ale Works, 4745 Council Heights Road, Oklahoma City, OK</h4>\r\n    <h4>73179 | <span>Learn More</span></h4>\r\n  </div>\r\n\r\n  <div class=\"event\" data-region=\"oklahoma city\">\r\n    <h2>Apr 25</h2>\r\n    <h3>Live Music in the #TheOldSailorTaproom</h3>\r\n    <p>\r\n      Live music in the taproom every Thursday! April 25 featuring Andy\r\n      Adams.\r\n    </p>\r\n    <h4>The Old Sailor Ale Works, 4745 Council Heights Road, Oklahoma City, OK</h4>\r\n    <h4>73179 | <span>Learn More</span></h4>\r\n  </div>\r\n\r\n  <div class=\"event\" data-region=\"oklahoma city\">\r\n    <h2>May 4</h2>\r\n    <h3>May the Fourth</h3>\r\n    <p>\r\n      May the Fourth be with you in the The Old Sailor taproom. Join us for Star\r\n      Wars trivia and costume contest.\r\n    </p>\r\n    <h4>The Old Sailor Ale Works, 4745 Council Heights Road, Oklahoma City, OK</h4>\r\n    <h4>73179 | <span>Learn More</span></h4>\r\n  </div>\r\n\r\n  <div class=\"event\" data-region=\"oklahoma city\">\r\n    <h2>May 4</h2>\r\n    <h3>Fly Me Away IPA Summer Release & Derby Party</h3>\r\n    <p>\r\n      Bet, win and fly away at our Fly Me Away IPA Summer Seasonal Release\r\n      and Derby party on The Pump patio.\r\n    </p>\r\n    <h4>The Pump, 2425 N. Walker Ave., Oklahoma City, OK</h4>\r\n    <h4>73103 | <span>Learn More</span></h4>\r\n  </div>\r\n\r\n  <div class=\"event\" data-region=\"tulsa\">\r\n    <h2>May 6</h2>\r\n    <h3>Fly Me Away Release + Bowling Fundraiser</h3>\r\n    <p>\r\n      Join us for a night of bowling and beer as we release our summer\r\n      seasonal Fly Me Away IPA.\r\n    </p>\r\n    <h4>Dust Bowl Lanes And Lounge, 211 S. Elgin Ave., Tulsa, OK</h4>\r\n    <h4>74210 | <span>Learn More</span></h4>\r\n  </div>\r\n</div>\r\n\r\n<!-- Taproom Menu -->\r\n<div class=\"menu taproom-menu taproom\" data-menu=\"taproom\">\r\n  <div class=\"menu__top-border\"></div>\r\n  <h2>Our Taproom</h2>\r\n  <h3 class=\"menu__header\">Open Today</h3>\r\n  <h4 class=\"menu__subheader\">12PM - 8PM</h4>\r\n  <h3 class=\"menu__header\">On Tap</h3>\r\n  <h4 class=\"menu__subheader\">Year Rounds</h4>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Haze Wizard</h2>\r\n    <h4>IPA</h4>\r\n    <h4>7.5% <span></span> 55</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Mango Smash</h2>\r\n    <h4>IPA</h4>\r\n    <h4>6.9% <span></span> 70</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Royal Blood</h2>\r\n    <h4>Blood Orange Wit</h4>\r\n    <h4>5.5% <span></span> 25</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Texas Gold</h2>\r\n    <h4>Kream Ale</h4>\r\n    <h4>4.7% <span></span> 14</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>GPA</h2>\r\n    <h4>German Pale Ale</h4>\r\n    <h4>5.2% <span></span> 52</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Texas Xmas</h2>\r\n    <h4>Stout</h4>\r\n    <h4>8.3% <span></span> 25</h4>\r\n  </div>\r\n\r\n  <!-- Specialty beers in taproom menu -->\r\n  <h3 class=\"menu__header\">On Tap</h3>\r\n  <h4 class=\"menu__subheader\">Specialties</h4>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Summer Love</h2>\r\n    <h4>Golden Ale</h4>\r\n    <h4>5.2% <span></span> 40</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>California Lager</h2>\r\n    <h4>2-Row Pale</h4>\r\n    <h4>4.9% <span></span> 19</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Santo</h2>\r\n    <h4>Kölsch</h4>\r\n    <h4>4.9% <span></span> 17</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Fancy Lawnmower</h2>\r\n    <h4>Kölsch</h4>\r\n    <h4>4.9% <span></span> 20</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Devout Crème Brulee</h2>\r\n    <h4>Kölsch</h4>\r\n    <h4>8.3% <span></span> 25</h4>\r\n  </div>\r\n\r\n  <div class=\"taproom-beer\">\r\n    <h2>Crazy Bavarian</h2>\r\n    <h4>Oktoberfest</h4>\r\n    <h4>5.8% <span></span> 25</h4>\r\n  </div>\r\n</div>";
},"useData":true});
templates['navbar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- main navigation container left-side icons and right-side menu icon -->\r\n<nav class=\"main-nav\">\r\n  <div class=\"nav-icons\">\r\n    <i class=\"fas fa-beer nav-icon\" data-icon=\"beer\"></i>\r\n    <i class=\"far fa-calendar-alt nav-icon\" data-icon=\"events\"></i>\r\n    <i class=\"fab fa-untappd nav-icon\" data-icon=\"taproom\"></i>\r\n  </div>\r\n  <a href=\"/old-sailor/\" class=\"nav-logo\">\r\n    <img src=\"/old-sailor/assets/images/old-sailor-logo.png\" alt=\"coop ale logo\" />\r\n  </a>\r\n  <div class=\"nav-menu\">\r\n    <p>Menu</p>\r\n    <div class=\"nav-menu__bars\">\r\n      <span></span>\r\n      <span></span>\r\n      <span></span>\r\n    </div>\r\n  </div>\r\n</nav>\r\n\r\n<!-- side navigation that slides in from the right-side of screen when user clicks menu icon -->\r\n<nav class=\"side-nav\">\r\n  <div class=\"side-nav__title\">\r\n    <h2>The Old Sailor</h2>\r\n    <h3>Ale Works</h3>\r\n  </div>\r\n\r\n  <i class=\"fas fa-times\"></i>\r\n\r\n  <div class=\"side-nav__menu\">\r\n    <div class=\"side-nav__menu--header\">\r\n      <h2>High Quality, Full Flavor Beer</h2>\r\n      <h2>Brewed in Oklahoma City</h2>\r\n    </div>\r\n\r\n    <div class=\"side-nav__menu--list\">\r\n      <a href=\"/old-sailor/beers\">Our Beer</a>\r\n      <a href=\"/old-sailor/events\">Events</a>\r\n      <a href=\"/old-sailor/beer-locator\">Beer Locator</a>\r\n      <a href=\"/old-sailor/taproom\">Taproom</a>\r\n      <a href=\"/old-sailor/about\">About Us</a>\r\n      <a href=\"/old-sailor/contact\">Contact</a>\r\n    </div>\r\n  </div>\r\n</nav>";
},"useData":true});
templates['beerInfoOverlay'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"overlay__arrow overlay__arrow--prev\">\r\n  <img src=\"/old-sailor/assets/icons/arrow-left.svg\" alt=\"arrow left\" />\r\n</div>\r\n<div class=\"overlay__arrow overlay__arrow--next\">\r\n  <img src=\"/old-sailor/assets/icons/arrow-right.svg\" alt=\"arrow right\" />\r\n</div>\r\n<div class=\"overlay__image\">\r\n  <img src=\"\" alt=\"\" data-src=\"/old-sailor/assets/images\" />\r\n</div>\r\n<div class=\"overlay__details\">\r\n  <div class=\"overlay__details--top\">\r\n    <div class=\"overlay__details--type\">\r\n      <p class=\"beer__availability\">Year-Round | Our Core Lineup</p>\r\n      <p class=\"beer__name\">F5</p>\r\n    </div>\r\n    <button class=\"btn btn__find\">Find This</button>\r\n  </div>\r\n  <div class=\"overlay__details--desc\">\r\n    <p>\r\n      A straightforward malt body supports the distinctive bouquet of\r\n      Columbus and Falconer’s Flight hops that impart citrus, grapefruit\r\n      and pine notes characteristic of the West Coast style. F5 is a\r\n      belligerent hop reckoning.\r\n    </p>\r\n  </div>\r\n  <div class=\"overlay__details--data\">\r\n    <div class=\"overlay__details--data__row\">\r\n      <p>Style</p>\r\n      <p class=\"beer__style\"></p>\r\n    </div>\r\n    <div class=\"overlay__details--data__row\">\r\n      <p>Alc/Vol</p>\r\n      <p class=\"beer__alc\"></p>\r\n    </div>\r\n    <div class=\"overlay__details--data__row\">\r\n      <p>IBU</p>\r\n      <p class=\"beer__ibu\"></p>\r\n    </div>\r\n  </div>\r\n  <p class=\"overlay__details--bottom\">\r\n    Available in 6 pack 12 FL OZ Cans or on draft.\r\n  </p>\r\n</div>\r\n<button class=\"btn btn__close\">Close</button>";
},"useData":true});
})();
},{}]},{},[9]);
