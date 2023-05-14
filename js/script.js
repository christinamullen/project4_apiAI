
//fetch the data
var cityArray = ["San Francisco", "San Rafael", "Orinda", "Hayward", "Sunnyvale"];
var ecityArray = ["Seattle", "Ashland", "San Diego", "Moab", "South Lake Tahoe"];
var origin = document.getElementById("startCitySelect");
var destination = document.getElementById("endCitySelect");

buildDropdown(cityArray, origin);
buildDropdown(ecityArray, destination);

function buildDropdown(array, select){
    for(var i = 0; i < array.length; i++) {
        var opt = document.createElement('option');
        opt.value = array[i];
        opt.innerHTML = array[i];
        select.appendChild(opt);
    }
}

var submitBtn = document.getElementById('searchButton');

submitBtn.addEventListener('click', function(e) {
  e.preventDefault();
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

  // Use Proxy server to calculate a route
  return fetch('https://basic-api-proxy-server.cnico078.repl.co/route', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ origin: originCoords, destination: destinationCoords })
  });
})
//obj to json
  .then(response => response.json())
  //do something w data
  .then(data => console.log(data))
  //.then(result => onResult(result))
  .catch(error => console.error('Error:', error));
});
