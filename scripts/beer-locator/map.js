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
