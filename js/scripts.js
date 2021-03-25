function togglesidebar() {
  document.getElementById('property-details').classList.toggle('active');


}

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGhld3BpZXRydXMiLCJhIjoiY2oya21sNnFtMDBkdzMzbnZ5NGh5dDM1eiJ9.wcy3gfH3AUsHi7Xzs58xPA';

  var map = new mapboxgl.Map({
    container: 'mapcontainer', // container ID
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    center: [-73.983780,40.721], // starting position [lng, lat]
    zoom: 13.85, // starting zoom
    pitch: 3,
});

// add the mapbox geocoder control
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
);

//add hover layer//
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
    }, 'road-label-large');
})

// when the user hovers over our nyc-cd layer make the mouse cursor a pointer
map.on('mouseenter', 'mncd3-fill', () => {
  map.getCanvas().style.cursor = 'pointer'
})
map.on('mouseleave', 'mncd3-fill', () => {
  map.getCanvas().style.cursor = ''
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

    popup.setLngLat(e.lngLat).setHTML(location).addTo(map);
  }
  else {
    popup.remove();
  }
})

map.on('click', function(e) {
  // query for the features under the mouse, but only in our custom layer
  var features = map.queryRenderedFeatures(e.point, {
      layers: ['mncd3-fill'],
  });

  if (features.length > 0 ) {
    // get the feature under the mouse pointer
    var hoveredFeature = features[0]

    // pull out zoning information (zoning district, max far, built far, landuse) economic variables (median asking rent, condo sales), regulatory hurdles (landmark, historic district, number of rent stabilized units, special district, floodzone), tax incentives (brownfield, lihtc, 421(a))
    var zone = hoveredFeature.properties._ZoneDist1
    var mxfar = hoveredFeature.properties.MaxFAR
    var sdist = hoveredFeature.properties._SPDist1
    var bltfar = hoveredFeature.properties.BltFARnew
    var landuse = hoveredFeature.properties.LandUse
    var units = hoveredFeature.properties.UnitsRes
    var rsunits = hoveredFeature.properties.unitcount
    var rent = hoveredFeature.properties.rents2015
    var lndmrk = hoveredFeature.properties._Landmark
    var hdist = hoveredFeature.properties._HistDist
    var tdr = hoveredFeature.properties.blocktdr
    var fldzne = hoveredFeature.properties.firms
    var brwn = hoveredFeature.properties.brwnyn
    var oppzne = hoveredFeature.properties.oppzneyn
    var qct = hoveredFeature.properties.lihtc
    var vih = hoveredFeature.properties.vihyn
    var freshtax = hoveredFeature.properties.fresh
    var mtaz = hoveredFeature.properties.mtazoiyn

    // inject these values into the sidebar
    $('.zone').text(`Zone: ${(zone)}`)
    $('.mxfar').text(`Max FAR: ${(mxfar)}`)
    $('.sdist').text(`Special District: ${(sdist)}`)
    $('.bltfar').text(`Built FAR: ${(bltfar)}`)
    $('.landuse').text(`Land Use Code: ${(landuse)}`)
    $('.units').text(`Units: ${(units)}`)
    $('.rsunits').text(`Stabilized Units: ${(rsunits)}`)
    $('.rent').text(`Area Asking Rent: $${(rent)}`)
    $('.tdr').text(`Potential TDRs: ${(tdr)}`)
    $('.lndmrk').text(`Landmark Status: ${(lndmrk)}`)
    $('.hdist').text(`Historic District: ${(hdist)}`)
    $('.fldzne').text(`Floodzone: ${(fldzne)}`)
    $('.brwn').text(`Brownfield: ${(brwn)}`)
    $('.oppzne').text(`Opportunity Zone: ${(oppzne)}`)
    $('.qct').text(`LIHTC: ${(qct)}`)
    $('.vih').text(`Inclusionary Housing: ${(vih)}`)
    $('.freshtax').text(`FRESH: ${(freshtax)}`)
    $('.mtaz').text(`MTA Zone of Influence: ${(mtaz)}`)




    // set this lot's polygon feature as the data for the highlight source
    map.getSource('highlight-feature').setData(hoveredFeature.geometry);
  }

})
