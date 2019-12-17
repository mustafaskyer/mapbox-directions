/**
 * @params {coords} => Map Point [lng, lat]
 */
function addMarker(coords) {
  new mapboxgl.Marker()
    .setLngLat(coords)
    .addTo(map);
}

/**
 * @params{callback} => function
 */
function apiRequest(p1, p2, callback) {
  const mainUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic'
  const url = `${mainUrl}/${p1};${p2}.json?access_token=${accessToken}&language=ar&geometries=geojson`
  var request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onload = function (d) {
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
      // console.log('#data', data)
      callback(data)
    } else {
      console.log('error')
    }
  }
  // Send request
  request.send()
}

/**
 * @params {id} => String
 */
const cache = (id) => {
  if (routes[id.toString()]) return routes[id.toString()]
  else return false
}

/**
 * @params {id} => String
 * @params {p1} => Map Point [lng, lat]
 * @params{p2} => Map Point [lng, lat]
 * @params{callback} => function
 */
const loadDirectionsBtweenTwoRoutes = async (id, p1, p2, callBack) => {
  if (!cache(id.toString())) {
    console.log('calling new route with id ', id)
    await apiRequest(p1, p2, (data) => {
      // caching
      routes[id] = data
      // calling callback
      callBack(data)
    })
  } else {
    console.log('@routeExist, Loading from cache ..', routes[id])
    callBack(routes[id])
  }
}

function drawRoute(data, callback) {
  drive_step = 0.0004
  drive_line_paint = {
    'line-width': 2,
    "line-gradient": [
      'interpolate',
      ['linear'],
      ['line-progress'],
      0, "#D9497D",
      0.5, "#EA6053",
      1, "#F97C24"
    ]
  }
  path = data.routes[0].geometry.coordinates
  // path = turf.lineString(path)
  temp_coordinates = []
  i = 1
  var path = turf.lineString(path);


  geojson = {
    type: 'Feature',
    geometry: {
      type: "LineString",
      coordinates: turf.along(path, 1)
    }
  }
  callback(geojson)
}

/**
 * @params {id} => String
 * @params {color} => String
 * @params {width} => Number
 */
function updateLayer(id, color, width) {
  const mapLayer = map.getLayer(id.toString());
  if (typeof mapLayer !== 'undefined') {
    console.log('removing layer ', mapLayer)
    // map.setPaintProperty(id, 'line-color', color);
    map.setPaintProperty(id.toString(), 'line-color', `${color}`);
    map.setPaintProperty(id.toString(), 'line-width', width);
    return;
  } else {
    // route not exist
  }
}

/**
 * @params {id} => String
 */
function removeLayer(id) {
  const mapLayer = map.getLayer(id.toString());
  if (typeof mapLayer !== 'undefined') {
    console.log('removing layer ', mapLayer)
    map.removeLayer(id.toString()).removeSource(id.toString())
  } else {
    // route not exist
  }
}
/**
 * @params {id} => String
 * @params {data} => object
 * @params{color} => String
 * @params{width} => Number
 */
const addLayer = (id, data, color, width, above = false) => {
  const coordinates = data.routes[0].geometry.coordinates
  console.log('@coords[addLayer]', coordinates)
  const mapLayer = map.getLayer(id.toString());
  if (typeof mapLayer !== 'undefined') {
    console.log('removing layer ', mapLayer)
    map.removeLayer(id.toString()).removeSource(id.toString());
  }
  addMarker(coordinates[0])
  addMarker(coordinates[coordinates.length - 1])
  map.addLayer({
    'id': id.toString(),
    'type': 'line',
    'source': {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        }
      }
    },
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': color,
      'line-width': width
    }
  });
}

const p1copy = [46.6029906, 24.761311]
const p2copy = [46.5473449, 24.7525403]
function fakeLoadDirections() {
  loadDirectionsBtweenTwoRoutes(1, p1copy, p2copy, data => addLayer(1, data, 'red', 1))
}