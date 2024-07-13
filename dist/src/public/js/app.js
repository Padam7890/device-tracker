const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send location", {
        latitude: latitude,
        longitude: longitude,
      });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
      maximumWait: 20000,
    }
  );
} else {
  alert("Geolocation is not supported by this browser.");
}


const map = L.map("map").setView([0,0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href=\"https://padamthapa.com.np/\">Padam Thapa</a> contributors"
}).addTo(map);

const markers = {

}

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  console.log(id)
  map.setView([latitude, longitude], 17);
 if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);

 }else{
    markers[id] = L.marker([latitude, longitude], markers).addTo(map);
 }

});

socket.on("disconnect", (id) => {   
    if(markers[id])
    {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
