![Leaflet](Leaflet.png)

# Leaflet

---

***Leaflet*** is an open source JavaScript library used to build web mapping applications. First released in 2011, it supports most mobile and desktop platforms, supporting HTML5 and CSS3. ***Leaflet*** is the leading open-source JavaScript library for mobile-friendly interactive maps. Weighing just about 39 KB of JS, it has all the mapping [features](https://leafletjs.com/#features) most developers ever need.

***Leaflet*** is designed with *simplicity*, *performance* and *usability* in mind. It works efficiently across all major desktop and mobile platforms, can be extended with lots of [plugins](https://leafletjs.com/plugins.html), has a beautiful, easy to use and [well-documented API](https://leafletjs.com/reference.html "***Leaflet*** API reference") and a simple, readable [source code](https://github.com/Leaflet/Leaflet "***Leaflet*** source code repository on GitHub") that is a joy to [contribute](https://github.com/Leaflet/Leaflet/blob/master/CONTRIBUTING.md "A guide to contributing to ***Leaflet***") to.

Here we create a map in the `'map'` div, add tiles of our choice, and then add a marker with some text in a popup:

```
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
```

Learn more with the [quick start guide](https://leafletjs.com/examples/quick-start/), check out [other tutorials](https://leafletjs.com/examples.html), or head straight to the [API documentation](https://leafletjs.com/reference.html). If you have any questions, take a look at the [FAQ](https://github.com/Leaflet/Leaflet/blob/master/FAQ.md) first.

---
