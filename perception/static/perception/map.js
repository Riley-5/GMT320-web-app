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


                    
                    