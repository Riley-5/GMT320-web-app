document.addEventListener('DOMContentLoaded', () => {
    addMap();
    getData();
});

function addMap() {
    var hatfieldMap = L.map('map').setView([-25.7487, 28.2380], 15);

    var darkTheme = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(hatfieldMap);
}

function getData() {
    fetch('/crime_data', {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}