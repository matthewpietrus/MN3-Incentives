mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGhld3BpZXRydXMiLCJhIjoiY2oya21sNnFtMDBkdzMzbnZ5NGh5dDM1eiJ9.wcy3gfH3AUsHi7Xzs58xPA';

  var map = new mapboxgl.Map({
    container: 'mapcontainer', // container ID
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    center: [-73.984880,40.719789], // starting position [lng, lat]
    zoom: 13.5, // starting zoom
    pitch: 3,
});

map.on('style.load', function () {
  //add geojson source, this can be pulled from mapboxgl//
  map.addSource('mncd3', {
    type: 'geojson',
    data: 'data/mncd3.geojson'
  });
//test out an extrude//
// map.addLayer({
//           'id': 'building-extrude',
//           'type': 'fill-extrusion',
//           'source': 'mncd3',
//           'paint': {
//               // See the Mapbox Style Specification for details on data expressions.
//               // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions
//
//               // Get the fill-extrusion-color from the source 'color' property.
//               'fill-extrusion-color': ['get', 'color'],
//
//               // Get fill-extrusion-height from the source 'height' property.
//               'fill-extrusion-height': ['get', 'PerBuilt'],
//
//               // Get fill-extrusion-base from the source 'base_height' property.
//               'fill-extrusion-base': ['get', 'PerBuilt'],
//
//               // Make extrusions slightly opaque for see through indoor walls.
//               'fill-extrusion-opacity': 0.5

  //add a layer to style source//
  map.addLayer({
    'id': 'mncd3-fill',
    'type': 'fill',
    'source': 'mncd3',
    'layout': {},
    'paint': {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'PerBuilt'],
          0,
          '#edf8fb',
          0.25,
          '#b3cde3',
          0.50,
          '#8c96c6',
          0.75,
          '#8856a7',
          1,
          '#810f7c',
          2,
          '#ff0000',
        ],
        'fill-opacity': 0.70
      }
    });
})
// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
closeButton: false,
closeOnClick: false
});

map.on('mousemove', function (e) {
  // query for the features under the mouse
  var features = map.queryRenderedFeatures(e.point, {
      layers: ['mncd3-fill'],
  });

  if (features.length > 0) {
    // Populate the popup and set its coordinates
    // based on the feature found.
    var feature = features[0]
    var location = feature.properties.Block
    var perbuilt = feature.properties.PerBuilt*100


    popup.setLngLat(e.lngLat).setHTML(perbuilt).addTo(map);
  }
  else {
    popup.remove();
  }
})
