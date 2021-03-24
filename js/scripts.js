function togglesidebar() {
  document.getElementById('property-details').classList.toggle('active');
}

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGhld3BpZXRydXMiLCJhIjoiY2oya21sNnFtMDBkdzMzbnZ5NGh5dDM1eiJ9.wcy3gfH3AUsHi7Xzs58xPA';

  var map = new mapboxgl.Map({
    container: 'mapcontainer', // container ID
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    center: [-73.984880,40.719789], // starting position [lng, lat]
    zoom: 13.5, // starting zoom
    pitch: 3,
});

//add mapbox geocoder//
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
);

map.on('style.load', function () {
  //add geojson source, this can be pulled from mapboxgl//
  map.addSource('mncd3var', {
    type: 'geojson',
    data: 'data/mncd3var.geojson'
  });

  map.addLayer({
    'id': 'mncd3-fill',
    'type': 'fill',
    'source': 'mncd3var',
    'layout': {},
    'paint': {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'likelihood'],
          -0.9,
          '#edf8fb',
          0,
          '#b3cde3',
          0.05,
          '#8c96c6',
          0.075,
          '#8856a7',
          0.1,
          '#810f7c',
          0.4,
          '#ff0000',
        ],
        'fill-opacity': 0.70
      },
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
    var location = feature.properties.Address
    var perbuilt = feature.properties.likelihood*100

    popup.setLngLat(e.lngLat).setHTML(perbuilt).addTo(map);
  }
  else {
    popup.remove();
  }
})

//Display property details on feature click, move sidebar.
