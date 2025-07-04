/* eslint-disable */
// console.log("Mapbox script loaded successfully!");

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWhtZWQyMTAzMjAwMyIsImEiOiJjbTJub2QxdzYwNzA3MmpzYm1iZmtsNjl5In0.X_eT3tUH5VnezQiu8ah_kA";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/ahmed21032003/cm2nri7jq005o01pm0a1l0y1j",
    scrollZoom: false,
    // center: [-118.113491, 34.111745], // starting position [lng, lat]
    // zoom: 10 // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    const el = document.createElement("div");
    el.className = "marker";
    // Create a marker and set its position
    new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(loc.coordinates)
      // .setPopup(
      //   new mapboxgl.Popup({ offset: 30 }).setHTML(
      //     `<h3>${loc.title}</h3><p>${loc.description}</p>`
      //   )
      // )
      .addTo(map);
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // Extend the bounds to include this location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
  // Add navigation controls to the map
  const nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-right");
}

