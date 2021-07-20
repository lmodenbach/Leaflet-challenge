
var allLastSevenDaysURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(allLastSevenDaysURL).then(function(response) {

function markerSize(quakeSize) {
    return quakeSize*20000;
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

var earthquakes = new L.LayerGroup();

for (var i = 0; i < response.features.length; i++) {
      L.circle(([response.features[i].geometry.coordinates[1], response.features[i].geometry.coordinates[0]]), {
      fillOpacity: 0.75,
      color: "black",
      weight: 0.5,
      fillColor: circleColor(Math.abs(response.features[i].geometry.coordinates[2])),
      radius: markerSize(Math.abs(response.features[i].properties.mag))
      }).bindPopup("<h3>Magnitude: " + response.features[i].properties.mag + 
                 "</h3><hr><h3>Depth: " + Math.abs(response.features[i].geometry.coordinates[2]) + "</h3><hr>" +
                 "<h3>Lat: " + response.features[i].geometry.coordinates[1] + ", Lng: " + 
                 response.features[i].geometry.coordinates[0] + "</h3>").addTo(earthquakes);
} 

d3.json("./static/data/tectonicplates-master/GeoJSON/PB2002_boundaries.json").then(function(geoData) {
    console.log(geoData);

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h4>Boundary: " + feature.properties.Name + "</h4>");
    }

    var plates = L.geoJSON(geoData, {
      onEachFeature: onEachFeature
    });

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 500,
      maxZoom: 20,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });;

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    });;

  var baseMaps = {
      "Street Map": streetmap,
      "Satellite Map": satellitemap,
      "Light Map": lightmap
  };

  var overlayMaps = {
    Plates: plates,
    Earthquakes: earthquakes
  };

  var myMap = L.map("quakeMap", {
    center: [37.8044363, -122.271111],
    zoom: 5,
    layers: [satellitemap, plates, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML = "<h4>Earthquake Depth (KM)</h4>" + [
      "<div class=\"box\" style=\"background-color: rgb(58, 240, 64)\"> < 5 </div>", 
      "<div class=\"box\" style=\"background-color: rgb(170, 240, 58)\">5 - 9.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(240, 240, 58)\">10 - 19.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(247, 185, 59)\">20 - 29.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(247, 128, 59)\">30 - 49.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(247, 62, 59)\">50 - 99.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(188, 59, 247)\">100 - 199.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(48, 58, 194)\">200 - 499.9</div>", 
      "<div class=\"box\" style=\"background-color: rgb(16, 19, 115); color: grey\">500 <= </div>"
    ].join("<br>");
    return div;
  };

  legend.addTo(myMap);

});

});