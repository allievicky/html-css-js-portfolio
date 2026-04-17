function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.getElementById("copyrightYear").textContent = new Date().getFullYear();

/* --- WEATHER LABS --- */

function formatMiniDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function displayMiniForecast(response) {
  let forecastHtml = "";
  // Show next 5 days
  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 6) { 
      forecastHtml += `
        <div class="mini-forecast-day">
          <div class="mini-forecast-date">${formatMiniDay(day.time)}</div>
          <img src="${day.condition.icon_url}" class="mini-forecast-icon" />
          <div class="mini-forecast-temp">
            <strong>${Math.round(day.temperature.maximum)}°</strong>
          </div>
        </div>`;
    }
  });
  document.querySelector("#mini-forecast").innerHTML = forecastHtml;
}

function refreshMiniWeather(response) {
  document.querySelector("#mini-city").innerHTML = response.data.city;
  document.querySelector("#mini-temp-val").innerHTML = Math.round(response.data.temperature.current);
  document.querySelector("#mini-details").innerHTML = response.data.condition.description;
  document.querySelector("#mini-humidity").innerHTML = `${response.data.temperature.humidity}%`;
  document.querySelector("#mini-wind").innerHTML = `${Math.round(response.data.wind.speed)} mph`;
  
  let iconElement = document.querySelector("#mini-icon");
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
  
  getMiniForecast(response.data.city);
}

function searchMiniCity(city) {
  let apiKey = "d09ba683abb40fodbd98ft033cff44a6";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  
  axios.get(apiUrl).then(refreshMiniWeather).catch(err => {
    console.error("Weather data fetch error:", err);
    document.querySelector("#mini-city").innerHTML = "City Not Found";
  });
}

function getMiniForecast(city) {
  let apiKey = "d09ba683abb40fodbd98ft033cff44a6";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayMiniForecast);
}

/* --- INITIALIZATION --- */

document.addEventListener("DOMContentLoaded", () => {
  const miniSearchBtn = document.querySelector("#mini-search-btn");
  const miniInput = document.querySelector("#mini-city-input");

  if (miniSearchBtn && miniInput) {
    miniSearchBtn.addEventListener("click", () => {
      searchMiniCity(miniInput.value);
    });

    miniInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchMiniCity(miniInput.value);
      }
    });

    // Default load city is Rome
    searchMiniCity("Rome");
  }
});