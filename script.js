const input = document.getElementById("ip-address-input");
const search = document.getElementById("search");
const error = document.getElementById("error");
const loading = document.getElementById("loading");
const ip_addressEL = document.getElementById("ip-address-info");
const locationEL = document.getElementById("location-info");
const timeZoneEL = document.getElementById("timezone-info");
const ISPEL = document.getElementById("isp-info");

let ip_address = "8.8.8.8";
let latitude = 51.505;
let longitude = -0.09;

//fetching data from API
async function updateData() {
  loading.style.display = "block";
  try {
    const dataResponse = await fetch(
      `https://geo.ipify.org/api/v1?apiKey=at_doRnANIejc4iLD5ErsJ5Klo0yTRDZ&ipAddress=${ip_address}`
    );
    const data = await dataResponse.json();
    latitude = data.location.lat;
    longitude = data.location.lng;
    updateInfo(data);
    createMap();
    loading.style.display = "none";
  } catch (error) {}
}

//set the infomation text
function updateInfo(data) {
  ip_addressEL.innerText = data.ip;
  locationEL.innerText = `${data.location.city},${data.location.country} ${data.location.postalCode}`;
  timeZoneEL.innerText = `UTC ${data.location.timezone}`;
  ISPEL.innerText = data.isp;
}

//create map
function createMap() {
  //render the map
  document.getElementById("searchMap").innerHTML = "<div id='mapid'></div>";

  //create new map
  var mymap = L.map("mapid").setView([latitude, longitude], 11);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(mymap);

  //put a customize marker
  var customIcon = L.icon({
    iconUrl: "./img/icon-location.svg",
    iconSize: [30, 40],
  });
  var marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(
    mymap
  );
}

//validate ip address
function validateAddress(address) {
  const reg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return reg.test(address);
}

//click search btn
function onHandleSearch(e) {
  e.preventDefault();
  console.log(input.value.trim());
  if (input.value.trim() == null || input.value.trim().length == 0) {
    console.log(error);
    showError("Please enter an address");
  } else {
    ip_address = input.value;
    if (validateAddress(ip_address)) {
      showSuccess();
      updateData();
    } else {
      showError("Address not found");
    }
  }
}
//error message
function showError(message) {
  error.style.opacity = 1;
  error.innerText = message;
}

function showSuccess() {
  error.style.opacity = 0;
}
//event listener
search.addEventListener("click", onHandleSearch);

updateData();
createMap();
//192.212.174.101
