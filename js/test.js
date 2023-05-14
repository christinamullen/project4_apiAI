//test the endpoint
fetch('https://basic-api-proxy-server.cnico078.repl.co/autocomplete?q=test')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    else{
        console.log('Endpoint is up and running');
    }
  })
  .catch(error => {
    console.error('Endpoint is down:', error);
  });