var myMap = L.map("quakeMap", {
    center: [37.8044363, -122.271111],
    zoom: 5
  });
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 500,
    maxZoom: 20,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

var allLastSevenDaysURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(allLastSevenDaysURL).then(function(response) {

function markerSize(quakeSize) {
    return quakeSize*10;
}


for (var i = 0; i < response.features.length; i++) {
    L.circle(([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]), {
      fillOpacity: 0.75,
      color: "rgb(215, 154, 227)",
      fillColor: "rgb(247, 171, 47)",
      radius: markerSize(response.features[i].properties.mag)

    }).bindPopup("<h1>" + response.features[i].properties.mag + "</h1><hr><h3>Magnitude Earthquake</h3>").addTo(myMap);
}
});

