mapboxgl.accessToken = mapToken;
const campground = JSON.parse(campgroundString);
console.log(campground);
const map = new mapboxgl.Map({
    language: 'ko',//not work
    container: 'map', // container ID
    style: 'mapbox://styles/sadfl/clc6c2knn004r14o4l3x0dppc', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker()
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
)
.setLngLat(campground.geometry.coordinates)
.addTo(map);