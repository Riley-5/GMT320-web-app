document.addEventListener('DOMContentLoaded', () => {
    getData();
    addMap();
});

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

function addMap() {
    var hatfieldMap = L.map('map').setView([-25.7487, 28.2380], 15);

    var darkTheme = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(hatfieldMap);

    addWFSLayer(hatfieldMap);
}

function addWFSLayer(map) {
    var owsrootUrl = 'http://geodev.co.za:8080/geoserver/group4/ows';

    var defaultParameters = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'group4:Hatfield_roads_min',
        outputFormat: 'application/json',
        format_options: 'callback:getJson',
        SrsName: 'EPSG:4326'
    };

    var parameters = L.Util.extend(defaultParameters);
    var URL = owsrootUrl + L.Util.getParamString(parameters);

    var WFSLayer = null;
    var ajax = $.ajax({
        url: URL,
        dataType: 'json',
        jsonpCallback: 'getJson',
        success: function(response) {
            WFSLayer = L.geoJson(response, {
                style: function(feature) {
                    return {
                        stroke: true,
                        weight: 2,
                        color: 'red'
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.streetname );
                }
            }).addTo(map);
        }
    });
}