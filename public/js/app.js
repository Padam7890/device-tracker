const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send location", {
        latitude,
        longitude,
      });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
} else {
  alert("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href=\"https://padamthapa.com.np/\">Padam Thapa</a> contributors"
}).addTo(map);

const markers = {};
const userPositions = {}; // Store user positions

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 12);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);

    // Show popup on click
    markers[id].on("click", () => {
      socket.emit("request-user-details", id);
    });
  }

  userPositions[id] = [latitude, longitude]; // Store the user's position

  // Routing between two users
  const userIds = Object.keys(userPositions);
  if (userIds.length >= 2) {
    const [user1, user2] = userIds.slice(-2); // Get the last two users
    L.Routing.control({
      waypoints: [
        L.latLng(userPositions[user1]),
        L.latLng(userPositions[user2])
      ],
      routeWhileDragging: true,
      reverseWaypoints: true
    }).addTo(map);
  }
});

socket.on("user-details", (details) => {
    const marker = markers[details.id];
    if (marker) {
      marker.bindPopup(`User ID: ${details.id}<br>User Details: ${JSON.stringify({
        latitude: details.latitude,
        longitude: details.longitude,
      })}`).openPopup();
    }
  });
  

socket.on("disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
    delete userPositions[id]; // Remove user position
  }
});
