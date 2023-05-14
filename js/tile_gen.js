const tiles =[
    {
        prompt:"San Francisco To Moab, UT", 
        icon: {
            src: "img/solarPanels.png",
            alt: "A map showing the journey from SF to Moab",
        },
        map: {
           src: "img/randomMap.jpg", 
           alt: "A map showing the journey from SF to Moab",
        },

    },
    {
        prompt:"San Francisco To Moab, UT", 
        icon: {
            src: "img/CCCounty.png",
            alt: "A map showing the journey from SF to Moab",
        },
        map: {
           src: "img/randomMap.jpg", 
           alt: "A map showing the journey from SF to Moab",
        },

    },
    {
        prompt:"San Francisco To Moab, UT", 
        icon: {
            src: "img/contractorPleasantHill.png",
            alt: "A map showing the journey from SF to Moab",
        },
        map: {
           src: "img/randomMap.jpg",
           alt: "A map showing the journey from SF to Moab", 
        },

    },
];

const container = document.getElementById("bottom-tiles");

tiles.forEach((data) => {
    let tile = document.createElement("DIV");
    tile.classList.add("sample-tiles");
    
    tile.innerHTML += `<h3>${data.prompt}<h3>`;
    tile.innerHTML += `<img src="${data.map.src}" alt="${data.map.alt}">`;
    
    container.appendChild(tile);
});
