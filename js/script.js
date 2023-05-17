///fetch the data
var cityArray = ["San Francisco, CA", "Sacramento, CA", "Bodega Bay, CA", "Santa Barbara, CA", "Sunnyvale"];
var ecityArray = ["Seattle, WA", "Bend, OR", "San Diego", "Moab, UT", "South Lake Tahoe"];
var rangeArray = [50, 100, 150, 200, 250, 300];
var origin = document.getElementById("startCitySelect");
var destination = document.getElementById("endCitySelect");
var range = document.getElementById("rangeSelect");

buildDropdown(cityArray, origin);
buildDropdown(ecityArray, destination);
buildDropdown(rangeArray, range);

function buildDropdown(array, select) {
  for (var i = 0; i < array.length; i++) {
    var opt = document.createElement('option');
    opt.value = array[i];
    opt.innerHTML = array[i];
    select.appendChild(opt);
  }
}

const map = L.map('map').setView([37.77429453858274, -122.43597088905996], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add ini marker to map
var originMarker = null;
var destinationMarker = null;
var submitBtn = document.getElementById('searchButton');

submitBtn.addEventListener('click', function() {
  //remove previous markers if not null
  if (originMarker != null) {
    map.removeLayer(originMarker);
  }
  if (destinationMarker != null) {
    map.removeLayer(destinationMarker);
  }
  generateRoute();
  document.getElementById("tripInfo").innerText = `Your trip: ${origin.value} to ${destination.value}`;

});

function generateRoute() {
  let originCity = origin.value;
  let destinationCity = destination.value;

  // fetch coordinates for origin and destination 
  //input as words, use here api to get geocode 
  //array of promises
  Promise.all([
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/geocode?city=${originCity}`, {
      method: 'GET'
    }),
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/geocode?city=${destinationCity}`, {
      method: 'GET'
    })
  ])
  //transform obj into json
  .then(([originResponse, destinationResponse]) => Promise.all([originResponse.json(), destinationResponse.json()]))
  
  //handle data
  .then(([originData, destinationData]) => {
    let originCoords = originData.items[0].position;
    let destinationCoords = destinationData.items[0].position;

    originMarker = L.marker(originCoords).addTo(map);
    destinationMarker = L.marker(destinationCoords).addTo(map);
    // Auto adjust the map to fit all markers
    const group = new L.featureGroup([originMarker, destinationMarker]);
    map.whenReady(function() {
      map.fitBounds(group.getBounds());
    })

    // Use Proxy server to calculate a route
    return fetch('https://basic-api-proxy-server.cnico078.repl.co/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          origin: originCoords,
          destination: destinationCoords
        })
      })
      //obj to json
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      //do something w data
      .then(routeData => ({
        routeData,
        originCoords,
        destinationCoords
      }));
    })
    //callback
    .then(({
      routeData,
      routeCoordinates
      
    }) => {
      console.log('Route Data: ' + routeData)
      //console.log('Route Coordinates: ' + routeCoordinates)

      // Extract route sections from the data
      const sections = routeData.routes[0].sections;
      console.log(sections);

      sections.forEach((section) => {
        //console.log("polyline: " + section.polyline);

        originMarker.bindPopup(`<b>Departure</b><br>Charge: ${section.departure.charge}%`);
        destinationMarker.bindPopup(`<b>Arrival</b><br>Charge: ${section.arrival.charge}%`);

        console.log(section.arrival.place.type);
        // If the arrival place is a charging station, add a special popup
        if (section.arrival.place.type === "chargingStation") {
          destinationMarker.bindPopup(`<b>Charging Station</b><br>ID: ${section.arrival.place.id}<br>Charge: ${section.arrival.charge}%`);
        }
        
      });

      // Auto adjust the map to fit all markers
      //const group = new L.featureGroup([originMarker, destinationMarker]);
     // map.whenReady(function() {
        //map.fitBounds(group.getBounds());
      //})
      
      
    })
    .catch(error => console.error('Error:', error));
  
}
