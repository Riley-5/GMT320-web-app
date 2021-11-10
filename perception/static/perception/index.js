document.addEventListener('DOMContentLoaded', () => {
    var locationMap = L.map('location-map').setView([-25.7545, 28.2314], 14);

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(locationMap);

    L.marker([-25.7545, 28.2314]).addTo(locationMap);

    locationMap.dragging.disable();
    locationMap.scrollWheelZoom.disable();
    locationMap.zoomControl.remove();
    locationMap.doubleClickZoom.disable();
    locationMap.boxZoom.disable();
    locationMap.keyboard.disable();
})