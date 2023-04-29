// Initialize and add the map
let marker;

function initMap() {
  // The location of Uluru
  const uluru = { lat: 19.472856977725773, lng: -70.69266546175004 };

  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: uluru,
  });
  // The marker, positioned at Uluru
  marker = new google.maps.Marker({
    draggable: true,
    position: uluru,
    map: map,
  });

  marker.addListener("click", toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function getOMSARoutes() {
  // Replace YOUR_API_KEY with your actual API key
  const apiKey = 'AIzaSyA3M2scHhzqN5G0QUvjCCcNLxMc3wCbNPY';
  const omsaQuery = 'OMSA Santiago de los Caballeros';

  // Use the Places Autocomplete API to find all locations containing the keyword "OMSA" in Santiago de los Caballeros
  const autocompleteEndpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${omsaQuery}&types=(cities)&components=country:do&key=${apiKey}`;

  fetch(autocompleteEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin:': '*',
      'API-Key': 'secret'
    }
  })
    .then(response => response.json())
    .then(data => {
      // Loop through each location containing the keyword "OMSA"
      for (let prediction of data.predictions) {
        const location = prediction.description;

        // Use the Directions API to find all transit routes for the location
        const directionsEndpoint = `https://maps.googleapis.com/maps/api/directions/json?origin=${location}&destination=${location}&mode=transit&transit_mode=bus&key=${apiKey}`;

        fetch(directionsEndpoint, {
          headers: {
            'Content-Type': 'application/json',
             'Access-Control-Allow-Origin:': '*',
            'API-Key': 'secret'
          }
        })
          .then(response => response.json())
          .then(data => {
            // Loop through each step of each route and print the route name if it belongs to the OMSA agency
            for (let route of data.routes) {
              for (let leg of route.legs) {
                for (let step of leg.steps) {
                  if (step.travel_mode === 'TRANSIT' && step.transit_details.line.agencies[0].name === 'OMSA') {
                    console.log(step.transit_details.line.name);
                  }
                }
              }
            }
          })
          .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
}

getOMSARoutes()
