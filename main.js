/**
 * demo data
 */
const p1 = [46.6029906, 24.761311]
const p2 = [46.5473449, 24.7525403]
const pointFrom = [46.700779, 24.7961951]
const pointMid = [46.7118425, 24.7970908]
const pointMid2 = [46.7137123, 24.7976144]
const pointTo = [46.7104286, 24.7968037]


const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: pointFrom,
  zoom: 13
});

map.on('load', function () {
  loadDirectionsBtweenTwoRoutes(1, pointFrom, pointMid, data => {
    const { distance, duration, weight } = data.routes[0]
    console.log('distance', distance)
    console.log('duration', duration)
    console.log('weight', weight)
    addLayer(1, data, '#4285f4', 12)
  })

  setTimeout(() => {
    updateLayer(1, 'red', 4)
    // removeLayer(1)
    console.log('should call out')
    loadDirectionsBtweenTwoRoutes(101, pointMid, pointTo , data => {
      const { distance, duration, weight, geometry } = data.routes[0]
      // console.log('@coords', geometry.coordinates)
      // console.log('distance', distance)
      // console.log('duration', duration)
      // console.log('weight', weight)
      // addMarker([46.559957, 24.7463])
      // addMarker([46.547407,24.753168])
      addLayer(101, data, 'yellow', 3)
    })
  }, 3000)
});