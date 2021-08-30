mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/rj1337/cksr8gjpzgx6y17mw2z6q3m5e', // style URL
        center: tattooShop.geometry.coordinates,
        zoom: 4 // starting zoom
    });

    new mapboxgl.Marker()
    .setLngLat(tattooShop.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${tattooShop.title}</h3><p>${tattooShop.location}</p>`
        )
    )
    .addTo(map)