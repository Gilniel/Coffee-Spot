
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: coffeebar.geometry.coordinates, // [longitude, latitude]
    zoom: 14
});

new mapboxgl.Marker()
    .setLngLat(coffeebar.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${coffeebar.title}</h3><p>${coffeebar.location}</p>`)
    ) // add popups
    .addTo(map);
