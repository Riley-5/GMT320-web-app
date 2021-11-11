document.addEventListener('DOMContentLoaded', () => {
    getData();
});

function getData() {
    // Fetches data for each individual street and crime. Aslo returns the total crime for a specific crime
    fetch('/crime_data', {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(crimeData => {
        graphsCrime(crimeData);
    });

    // Fetches individual street crime totals -> for each street total crime 
    fetch('/total_crimes', {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(totalCrimeStreet => {
        graphsCrimeStreet(totalCrimeStreet);
        addMap(totalCrimeStreet);
    });
}

function addMap(totalCrimesPerStreet) {
    var hatfieldMap = L.map('map').setView([-25.7487, 28.2380], 14);
    hatfieldMap.doubleClickZoom.disable();

    var darkTheme = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(hatfieldMap);

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Mouse moves over map displays the coordinates
    mouseOverCoordinates(hatfieldMap);

    // Double click to full screen 
    // If in full screen double click to exit
    doubleClickFUllscreen(hatfieldMap);
    
    addWFSLayer(hatfieldMap, totalCrimesPerStreet, darkTheme, osm);
}

// Mouse moves over map displays the coordinates
function mouseOverCoordinates(map) {
    map.addEventListener('mousemove', function(e) {
        document.querySelector('#coordinates').innerHTML = `Lat: ${e.latlng.lat} Lng: ${e.latlng.lng}`;
    });
}

// Double click to full screen 
// If in full screen double click to exit
function doubleClickFUllscreen(map) {
    map.addEventListener('dblclick', () => {
        var map = document.querySelector('#map');
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            map.requestFullscreen();
        }
    });
}

function addWFSLayer(map, crimePerStreetTotal, darkTheme, osm) {
    var owsrootUrl = 'http://geolive.co.za:8080/geoserver/githubbers/ows';

    var defaultParameters = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'githubbers:roads',
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
                    var name = feature.properties.streetname;
                    var value;

                    // If returned object is empty => color roads green
                    if (JSON.stringify(crimePerStreetTotal) === '{}') {
                        return {
                            color: 'green'
                        }
                    }

                    // sets the color according to how much crime is on the street
                    // Crime >= 100 then color = red
                    // 80 <= Crime < 100 then color = orange
                    // Crime < 80 then color = green
                    switch (name) {
                        case "Arcadia Street": value = crimePerStreetTotal.arcadia_street; break;
                        case "Athlone Street": value = crimePerStreetTotal.athlone_street; break;
                        case "Burnett Street": value = crimePerStreetTotal.burnett_street; break;
                        case "End Street": value = crimePerStreetTotal.end_street; break;
                        case "Festival Street": value = crimePerStreetTotal.festival_street; break;
                        case "Francis Baard Street": value = crimePerStreetTotal.francis_baard_street; break;
                        case "Glyn Street South": value = crimePerStreetTotal.glyn_street_south; break;
                        case "Gordon Road": value = crimePerStreetTotal.gordon_road; break;
                        case "Grosvenor Street": value = crimePerStreetTotal.grosvenor_street; break;
                        case "Hartbeestspruit Street": value = crimePerStreetTotal.hartbeestspruit_street; break;
                        case "Hilda Street": value = crimePerStreetTotal.hilda_street; break;
                        case "Jan Shoba Street": value = crimePerStreetTotal.jan_shoba_street; break;
                        case "Park Street": value = crimePerStreetTotal.park_street; break;
                        case "Pretorius Street": value = crimePerStreetTotal.pretorius_street; break;
                        case "Prospect Street": value = crimePerStreetTotal.prospect_street; break;
                        case "Richard Street": value = crimePerStreetTotal.richard_street; break;
                        case "South Street": value = crimePerStreetTotal.south_street; break;
                        case "Stanza Bobape Street": value = crimePerStreetTotal.stanza_bobape_street; break;
                        default: value = 0;
                    }

                    if (value >= 100) {
                        return {
                            color: 'red'
                        }
                    } 
                    else if (value < 80) {
                        return {
                            color: 'green'
                        }
                    } 
                    else {
                        return {
                            color: 'orange'
                        }
                    }
                }
            }).addTo(map);
            popUp(WFSLayer);
            layerController(map, darkTheme, osm, WFSLayer);
        }
    });
}

// When road clicked on display the road name
function popUp(roads) {    
    roads.eachLayer(function (layer) {
        layer.bindPopup(layer.feature.properties.streetname);
    });
}

// Layer controller to toggle between basemaps and overlay maps
function layerController(map, darkTheme, osm, WFSLayer) {
    var baseMaps = {
        "Dark Theme": darkTheme,
        "OSM": osm
    }

    var overlayMaps = {
        "Roads": WFSLayer
    }

    L.control.layers(baseMaps, overlayMaps).addTo(map);
}
	     
function graphsCrime(crimeData) {
    // Line graph
    // Graph shows the total crime for each crime recorded over time
    var ctx2 = document.querySelector('#canvas-line-graph').getContext('2d');
    var lineChart = new Chart(ctx2, {
        data: {
            labels: crimeData.years,
            datasets: [{
                type: 'line',
                label: 'Attempted Murder',
                data: crimeData.attempted_murder,
                backgroundColor: [
                    'rgba(255, 0, 0)',
                ],
                borderColor: [
                    'rgba(255, 0, 0)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            }, 
            {
                type: 'line',
                label: 'Damage to Property',
                data: crimeData.damage_to_property,
                backgroundColor: [
                    'rgba(0, 66, 255)',
                ],
                borderColor: [
                    'rgba(0, 66, 255)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Drunk Driving',
                data: crimeData.drunk_driving,
                backgroundColor: [
                    'rgba(31, 255, 0)',
                ],
                borderColor: [
                    'rgba(31, 255, 0)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Sexual Assault',
                data: crimeData.sexual_assault,
                backgroundColor: [
                    'rgba(236, 255, 0)',
                ],
                borderColor: [
                    'rgba(236, 255, 0)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Shoplifting',
                data: crimeData.shoplifting,
                backgroundColor: [
                    'rgba(255, 0, 170)',
                ],
                borderColor: [
                    'rgba(255, 0, 170)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Vehicle Theft',
                data: crimeData.vehicle_theft,
                backgroundColor: [
                    'rgba(255, 255, 255)',
                ],
                borderColor: [
                    'rgba(255, 255, 255)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            }],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Crime Count Over Time',
                    color: 'white'
                },
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        }
    });

    lineChart.render();
}

function graphsCrimeStreet(totalCrimeStreet) {
    // Side bar chart
    // Chart shows the total crime for each street
    var chartColors = {
        red: 'rgba(255, 0, 0)',
        orange: 'rgba(255, 105, 0)',
        green: 'rgba(0, 255, 0)'
    };

    var ctx = document.querySelector('#canvas-side-bar').getContext('2d');
    var barChart = new Chart(ctx, {
        data: {
            labels: Object.keys(totalCrimeStreet),
            datasets: [{
                type: 'bar',
                data: Object.values(totalCrimeStreet),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderWidth: 1
            }],
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Total Crime Per Street',
                    color: 'white'
                }
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: 'white'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    }
                }
            }
        },
    });

    // Conditional colours for bar graph to match roads
    var dataset = barChart.data.datasets[0];
    for (var i = 0; i < dataset.data.length; i++) {
        if (dataset.data[i] >= 100) {
            dataset.backgroundColor[i] = chartColors.red;
        }
        else if (dataset.data[i] < 80) {
            dataset.backgroundColor[i] = chartColors.green;
        }
        else {
            dataset.backgroundColor[i] = chartColors.orange;
        }
    }
    barChart.update();
} 