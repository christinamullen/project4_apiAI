///fetch the data
var cityArray = ["San Francisco, CA", "Sacramento, CA", "Bodega Bay, CA", "Santa Barbara, CA", "Sunnyvale"];
var ecityArray = ["Seattle, WA", "Bend, OR", "San Diego", "Moab, UT", "South Lake Tahoe"];
var rangeArray = [50, 100, 150, 200, 250, 300];
var origin = document.getElementById("startCitySelect");
var destination = document.getElementById("endCitySelect");
var range = document.getElementById("rangeSelect");
let totalDistance = 0;

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
const destinationMap = L.map('destinationMap').setView([37.77429453858274, -122.43597088905996], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(destinationMap);

//add ini marker to map
var originMarker = null;
var destinationMarker = null;
var submitBtn = document.getElementById('searchButton');

//destination lat,lng
var arrivalLat = " ";
var arrivalLng = " ";
var coordinates

submitBtn.addEventListener('click', function() {
  //remove previous markers if not null
  if (originMarker != null) {
    map.removeLayer(originMarker);
  }
  if (destinationMarker != null) {
    map.removeLayer(destinationMarker);
  }

  generateRoute();
  
  //Trip details for front
  document.getElementById("tripInfo").innerText = `Your trip: ${origin.value} to ${destination.value}`;
  //document.getElementById("tripInfo2").innerText = `click for trip details`;
  //details for back


});

function generateRoute() {
  try {
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
    .then(routeData => {
      console.log('Route data before processing:', routeData);
    
      // Extract the sections from the route data
      const sections = routeData.routes[0].sections;
    
      // Calculate the total distance of the route by adding up the lengths of all sections
      totalDistance = 0;


      sections.forEach(section => {
        console.log('section: ', section.travelSummary.length);
        totalDistance += section.travelSummary.length;
        
        arrivalLat = section.arrival.place.location.lat;
        console.log('destination lat: ', arrivalLat); 
        arrivalLng = section.arrival.place.location.lng;
        console.log('destination lng: ', arrivalLng);
      });

      var totalMiles = (totalDistance /1000)*0.621371;
      console.log('Total distance of the route:', totalMiles);
      console.log('range: ', range.value);
      console.log('destination lat, lng: ', arrivalLat, ", ", arrivalLng); 
/**Where are the destinationCoords returned in the response?****************** */


    
      var selectedRange = range.value;
      var chargeTimes = totalMiles/range.value;
      //call tripdata to put trip info on back of flippy card
      addTripData(totalMiles, chargeTimes, selectedRange, destinationCity);
      if (chargeTimes <= 1){
        console.log('Based on your vehicle\'s range of ', range.value, ' you should reach your destination without needing to charge! You will need to charge when you get there. Here are some options: ');
      } else {
        console.log('Based on your vehicle\'s range of ', range.value, ' you will need to charge at least ',  chargeTimes, ' times to reach your destination.');
      }
      return {
        routeData,
        originCoords: routeData.originCoords,
        destinationCoords: routeData.destinationCoords
      };
    })
    
    // Fetch charging stations along the route
  .then (data => fetch('https://basic-api-proxy-server.cnico078.repl.co/discover_chargingStations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      location: { 
          lat: arrivalLat, 
          lng: arrivalLng 
      } 
  })
  }))
    .then(response => response.json())
    .then(chargingStationsData => {
      console.log('charging station data:', chargingStationsData);
      console.log('charging station name: ', chargingStationsData.items[2].title)
      coordinates = [arrivalLat, arrivalLng];
      console.log(coordinates);

      chargingStationsData.items.forEach(station => {
        if (station.title === "ChargePoint"){
          return;
        } else {
          let marker = L.marker([station.position.lat, station.position.lng]).addTo(destinationMap);
        marker.bindPopup(`<b>${station.title}</b><br>${station.address.houseNumber} ${station.address.street} <br>${station.address.city}, ${station.address.stateCode} ${station.address.postalCode}  `);
        }
        
      });
      destinationMap.setView(coordinates, 13); //change map view
      
    })
    .catch(error => console.error('Error:', error));
    });
  } catch (error) {
    console.error('Error in generateRoute function:', error);
  }
}

//function adds trip summary to back of first tile
function addTripData(totalMiles, chargeTimes, selectedRange, destination) {
  totalMiles = totalMiles.toFixed(2);
  chargeTimes = chargeTimes.toFixed(0);

  document.getElementById("tripDetails").innerText = `You're going ${totalMiles} miles!`;
  if (chargeTimes <= 1){
    document.getElementById("summary").innerText = `Based on your vehicle\'s range of ${selectedRange} you should reach your destination without needing to charge! Be sure to charge when you arrive `;
  } else {
    document.getElementById("summary").innerText = `Based on your vehicle\'s range of ${selectedRange} you will need to charge at least ${chargeTimes} times to reach your destination.`;
  }
  //document.getElementById("turnByturn").innerText = `Turn by Turn directions`;
  document.getElementById("stations").innerText = `Charging station options near ${destination}`;
  document.getElementById("arrow").src = 'img/downArrow.png';
  
 }
