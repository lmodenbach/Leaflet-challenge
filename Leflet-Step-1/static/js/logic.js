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
    return quakeSize*10000;
}


//depth 0km - 671.69km
function circleColor(quakeDepth) {
  var color = "";
  
    if (quakeDepth < 5)
      color = "rgb(58, 240, 64)"; 
    else if (quakeDepth < 10)
      color = "rgb(170, 240, 58)";
    else if (quakeDepth < 20)
      color = "rgb(240, 240, 58)";
    else if (quakeDepth < 30)
      color = "rgb(247, 185, 59)";
    else if (quakeDepth < 50)
      color = "rgb(247, 128, 59)";
    else if (quakeDepth < 100)
      color = "rgb(247, 62, 59)";
    else if (quakeDepth < 200)
      color = "rgb(188, 59, 247)";
    else if (quakeDepth < 500)
      color = "rgb(48, 58, 194)";
    else if (quakeDepth >= 500)
      color = "rgb(16, 19, 115)";
    else
      color = "black";

  return color;
}


for (var i = 0; i < response.features.length; i++) {
    L.circle(([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]), {
      fillOpacity: 0.75,
      color: "black",
      weight: 0.5,
      fillColor: circleColor(Math.abs(response.features[i].geometry.coordinates[2])),
      radius: markerSize(Math.abs(response.features[i].properties.mag))
      
    }).bindPopup("<h2>Magnitude: " + response.features[i].properties.mag + "</h2><hr><h2>Depth: " + Math.abs(response.features[i].geometry.coordinates[2]) + "</h2>")
    .addTo(myMap);
    
  } 

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 5, 10, 20, 30, 50, 100, 200, 500];
    var colors = ["rgb(58, 240, 64)", "rgb(170, 240, 58)", "rgb(240, 240, 58)", "rgb(247, 185, 59)", "rgb(247, 128, 59)", "rgb(247, 62, 59)", "rgb(188, 59, 247)", "rgb(48, 58, 194)", "rgb(16, 19, 115)"];
    var labelText = ["Depth < 5KM", "5KM <= Depth < 10KM", "10KM <= Depth < 20KM", "20KM <= Depth < 30KM", "30KM <= Depth < 50KM", "50KM <= Depth < 100KM", "100KM <= Depth < 200KM", "200KM <= Depth < 500KM", "500KM <= Depth"];
    var labels = [];

    div.innerHTML = "<h2><strong>Earthquake Depth</strong></h2>";

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"><strong>" + labelText[index] + "</strong></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  legend.addTo(myMap);

});

