

// Replace with your own API key from OpenWeatherMap
const apiKey = "e821d00b20b175bf12b854969e11e964";

const cityInput = document.getElementById("cityInput");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");
const button = document.getElementById("checkBtn");
const locationBtn = document.getElementById("locationBtn");
const iconEl = document.getElementById("weatherIcon");

// Click button
button.addEventListener("click", showCity);
if (locationBtn) {
  locationBtn.addEventListener("click", getLocationWeather);
}

// Press Enter inside input
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    showCity();
  }
});

function showCity() {
  const city = cityInput.value.trim();
  errorEl.textContent = "";
  resultEl.innerHTML = "";
  iconEl.style.display = "none";
  iconEl.removeAttribute("src");
  iconEl.removeAttribute("alt");

  if (!city) {
    errorEl.textContent = "Please enter a city name.";
    return;
  }

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) +
    "&appid=" +
    apiKey +
    "&units=metric";

  resultEl.textContent = "Loading weather data...";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      renderWeather(data);
    })
    .catch(() => {
      resultEl.textContent = "";
      errorEl.textContent = "City not found. Please try again.";
    });
}

function renderWeather(data) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const description = data.weather[0].description;
  const cityName = data.name;
  const country = data.sys.country;
  const humidity = data.main.humidity;
  const iconCode = data.weather[0].icon;

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  iconEl.src = iconUrl;
  iconEl.alt = description + " icon";
  iconEl.style.display = "block";

  resultEl.innerHTML = `
    <div class="weather-title">${cityName}, ${country}</div>
    <div class="weather-line">Temperature: ${temp}°C (feels like ${feelsLike}°C)</div>
    <div class="weather-line">Weather: ${description}</div>
    <div class="weather-line">Humidity: ${humidity}%</div>
  `;
}

function getLocationWeather() {
  errorEl.textContent = "";
  resultEl.textContent = "Getting your location...";

  if (!navigator.geolocation) {
    errorEl.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=metric";

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          renderWeather(data);
        })
        .catch(() => {
          errorEl.textContent = "Could not get weather for your location.";
        });
    },
    () => {
      errorEl.textContent = "Location permission denied.";
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {

  if (!navigator.geolocation) return;

  resultEl.textContent = "Detecting your location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        apiKey +
        "&units=metric";

      fetch(url)
        .then(response => response.json())
        .then(data => {
          renderWeather(data);
        });

    },
    () => {
      resultEl.textContent = "";
    }
  );

});

