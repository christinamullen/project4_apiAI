
///fetch the data
var cityArray = ["San Francisco", "San Rafael", "Orinda", "Hayward", "Sunnyvale"];
var ecityArray = ["Seattle", "Ashland", "San Diego", "Moab", "South Lake Tahoe"];
var rangeArray = [50, 100, 150, 200, 250, 300];
var origin = document.getElementById("startCitySelect");
var destination = document.getElementById("endCitySelect");
//var range = document.getElementById("rangeSelect");

buildDropdown(cityArray, origin);
buildDropdown(ecityArray, destination);
//buildDropdown(rangeArray, range);

function buildDropdown(array, select){
    for(var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        select.appendChild(opt);
    }
}

const map = L.map('map').setView([ 37.77429453858274, -122.43597088905996], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var submitBtn = document.getElementById('searchButton');

submitBtn.addEventListener('click', generateRoute);

function generateRoute(){
  let originCity = origin.value;
  let destinationCity = destination.value;

  // fetch coordinates for origin and destination
  //array of promises
  Promise.all([
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/geocode?city=${originCity}`, {method: 'GET'}),
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/geocode?city=${destinationCity}`, {method: 'GET'})
  ])
  //transform obj into json
  .then(([originResponse, destinationResponse]) => Promise.all([originResponse.json(), destinationResponse.json()]))
  //handle data
  .then(([originData, destinationData]) => {
    let originCoords = originData.items[0].position;
    let destinationCoords = destinationData.items[0].position;

  // Fetch charging stations along the route
  return fetch('https://basic-api-proxy-server.cnico078.repl.co/chargingstations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ origin: originCoords, destination: destinationCoords })
  })
  .then(response => response.json())
  .then(chargingStationsData => {
    chargingStationsData.forEach(station => {
      let marker = L.marker([station.lat, station.lng]).addTo(map);
      marker.bindPopup(`<b>${station.name}</b><br>Capacity: ${station.capacity}`);
    });

  // Center map on line
  //map.fitBounds(polyline.getBounds());
  let bounds = L.latLngBounds(allPoints);
  map.fitBounds(bounds);
});
})
  .catch(error => console.error('Error:', error));
}


