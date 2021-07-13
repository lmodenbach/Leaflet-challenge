var allLastSevenDaysURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(allLastSevenDaysURL).then(function(response) {

    console.log(response);
    
function markerSize(quakeSize) {
    return quakeSize;
}

var myMap = L.map("quakeMap", {
    center: [37.8044, 122.2712],
    zoom: 10
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 20,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// Loop through the earthquakes array and create one marker for each earthquake object
for (var i = 0; i < response.length; i++) {
    L.circle(([response.features[index].geometry.coordinates[1], response.features[index].geometry.coordinates[0]]), {
      fillOpacity: 0.75,
      color: "rgb(215, 154, 227)",
      fillColor: "rgb(247, 171, 47)",
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its quake magnitude
      radius: markerSize(response.features[i].properties.mag)
    }).bindPopup("<h1>" + response.features[i].properties.mag + "</h1> <hr> <h3>Magnitude Earthquake</h3>").addTo(myMap);
}
});


//center: [response.features[index].geometry.coordinates[1], response.features[index].geometry.coordinates[0]],