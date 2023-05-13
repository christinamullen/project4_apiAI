function getContractors(){
  const url = "";

  //fetch the data
  fetch(url)
  .then((response) => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json(); //Parses JSON data
  })
  .then((data) => {
    
  })
  .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
  });
}