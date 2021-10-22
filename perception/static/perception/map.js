document.addEventListener('DOMContentLoaded', () => {
    getData();
});

function getData() {
    fetch('/crime_data', {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(crimeData => {
        console.log(crimeData);
        graphsCrime(crimeData);
    });

    fetch('/total_crimes', {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(totalCrimeStreet => {
        console.log(totalCrimeStreet);
        graphsCrimeStreet(totalCrimeStreet);
        addMap(totalCrimeStreet);
    });
}

function addMap(totalCrimesPerStreet) {
    var hatfieldMap = L.map('map').setView([-25.7487, 28.2380], 15);

    var darkTheme = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(hatfieldMap);

    addWFSLayer(hatfieldMap, totalCrimesPerStreet);
}

function addWFSLayer(map, crimePerStreetTotal) {
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
                    var name = feature.properties.streetname;
                    var value;
                    
                    // double check if new year stakcs or only shows for latest year
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
                        case "Pretoriues Street": value = crimePerStreetTotal.pretorius_street; break;
                        case "Prospect Street": value = crimePerStreetTotal.prospect_street; break;
                        case "Richard Street": value = crimePerStreetTotal.richard_street; break;
                        case "South Street": value = crimePerStreetTotal.south_street; break;
                        case "Stanza Bopabe Street": value = crimePerStreetTotal.stanza_bobape_street; break;
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
        }
    });
}

function popUp(streets) {    
    streets.eachLayer(function (layer) {
        layer.bindPopup(layer.feature.properties.streetname);
    });
}

function graphsCrime(crimeData) {
    // Side bar chart
    var ctx = document.querySelector('#canvas-side-bar').getContext('2d');
    var myChart = new Chart(ctx, {
        data: {
            labels: ['Attempted Murder', 'Damage to Property', 'Drunk Driving', 'Sexual Assualt', 'Shoplifting', 'Vehicle Theft'],
            datasets: [{
                type: 'bar',
                data: [crimeData.attempted_muder_total, crimeData.damage_to_property_total, crimeData.drunk_driving_total, crimeData.sexual_assault_total, crimeData.shoplifting_total, crimeData.vehicle_theft_total],
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
                }
            }
        },
    });

    // Line graph
    let line_data = [{x: 'Attempted Murder', y: crimeData.attempted_muder_total}, {x: 'Damage to Property', y: crimeData.damage_to_property_total}, {x: 'Drunk Driving', y: crimeData.drunk_driving_total}, {x: 'Sexual Assault', y: crimeData.sexual_assault_total}, {x: 'Shoplifting', y: crimeData.shoplifting_total}, {x: 'Vehicle Theft', y: crimeData.vehicle_theft_total}]
    var ctx2 = document.querySelector('#canvas-line-graph').getContext('2d');
    var myChart = new Chart(ctx2, {
        data: {
            labels: crimeData.year,
            datasets: [{
                type: 'line',
                label: 'Attempted Murder',
                data: crimeData.attempted_muder,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderWidth: 1,
                yAxisID: 'y'
            }, 
            {
                type: 'line',
                label: 'Damage to Property',
                data: crimeData.damage_to_property,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderWidth: 1,
                yAxisID: 'y1'
            },
            {
                type: 'line',
                label: 'Drunk Driving',
                data: crimeData.drunk_driving,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderWidth: 1,
                yAxisID: 'y1'
            },
            {
                type: 'line',
                label: 'Sexual Assault',
                data: crimeData.sexual_assault,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderWidth: 1,
                yAxisID: 'y1'
            },
            {
                type: 'line',
                label: 'Shoplifting',
                data: crimeData.shoplifting,
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderWidth: 1,
                yAxisID: 'y1'
            },
            {
                type: 'line',
                label: 'Vehicle Theft',
                data: crimeData.vehicle_theft,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderWidth: 1,
                yAxisID: 'y1'
            }],
        },
        stacked: false
    });
}

function graphsCrimeStreet(totalCrimeStreet) {
    // Pie chart
    var ctx = document.querySelector('#canvas-pie-chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Arcadia Street', 'Athlone Street', 'Burnett Street', 'End Street', 'Festival Street', 'Francis Baard Street', 'Glyn Street South', 'Gordon Road', 'Grosvenor Street', 'Hartbeestspruit Street', 'Hilda Street', 'Jan Schoba Street', 'Park Street', 'Pretorius Street', 'Prospect Street', 'Richard Street', 'South Street', 'Stanza Bobape Street'],
            datasets: [{
                data: [totalCrimeStreet.arcadia_street, totalCrimeStreet.athlone_street, totalCrimeStreet.burnett_street, totalCrimeStreet.end_street, totalCrimeStreet.festival_street, totalCrimeStreet.francis_baard_street, totalCrimeStreet.glyn_street_south, totalCrimeStreet.gordon_road, totalCrimeStreet.grosvenor_street, totalCrimeStreet.hartbeestspruit_street, totalCrimeStreet.hilda_street, totalCrimeStreet.jan_schoba_street, totalCrimeStreet.park_street, totalCrimeStreet.pretorius_street, totalCrimeStreet.prospect_street, totalCrimeStreet.richard_street, totalCrimeStreet.south_street, totalCrimeStreet.stanza_bobape_street],
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
        }
    });
}
                    
                    