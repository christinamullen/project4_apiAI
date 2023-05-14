
//fetch the data
const startInput = document.querySelector('#startQuery');
const endInput = document.querySelector('#endQuery');

startInput.addEventListener('input', () => {
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/autocomplete?q=${input.value}`)
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
    fetch(`https://basic-api-proxy-server.cnico078.repl.co/autocomplete?q=${input.value}`)
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

