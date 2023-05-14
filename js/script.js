
//fetch the data
const startInput = document.querySelector('#startQuery');
const endInput = document.querySelector('#endQuery');

startInput.addEventListener('input', () => {
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/autocomplete?q=${startInput.value}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json(); //Parses JSON data
    })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
  });
});

endInput.addEventListener('input', () => {
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/autocomplete?q=${endInput.value}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json(); //Parses JSON data
    })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
  });
});
//document.ready()
$(function() {
    function suggest(term, callback) {
      $.getJSON(`https://basic-api-proxy-server.cnico078.repl.co/autocomplete?q=${term}`, function(data) {
        var suggestions = data.suggestions.map(function(suggestion) {
          return suggestion.label; 
        });
        callback(suggestions);
      });
    }
  
    $("#startQuery").autocomplete({
      source: suggest,
      minLength: 2
    });
  
    $("#endQuery").autocomplete({
      source: suggest,
      minLength: 2
    });
  });
