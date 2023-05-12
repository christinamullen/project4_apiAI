const tiles =[
    {
        prompt:"Who installed the most solar panels in Concord?", 
        icon: {
            src: "img/solarPanels.png",
            alt: "solar panels",
        },
        map: {
           src: "img/randomMap.jpg", 
           alt: "Contractor who installs EV Chargers in Pleasant Hill",
        },

    },
    {
        prompt:"How many heat pump HVAC systems were installed in Contra Costa County last year?", 
        icon: {
            src: "img/CCCounty.png",
            alt: "a map of Contra Costa County",
        },
        map: {
           src: "img/randomMap.jpg", 
           alt: "Contractor who installs EV Chargers in Pleasant Hill",
        },

    },
    {
        prompt:"Which contractor should I use to install an EV Charger in Pleasant Hill?", 
        icon: {
            src: "img/contractorPleasantHill.png",
            alt: "Contractor who installs EV Chargers in Pleasant Hill",
        },
        map: {
           src: "img/randomMap.jpg",
           alt: "Contractor who installs EV Chargers in Pleasant Hill", 
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
