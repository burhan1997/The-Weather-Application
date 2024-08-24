let isMetric = true;

let weather = {
  fetchWeather: function (city) {
    document.querySelector(".weather").classList.add("loading");
    document.querySelector(".error-message").innerText = "";

    fetch(`/weather?city=${city}&units=${isMetric ? "metric" : "imperial"}`)
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data.weather);
        this.displayHourlyForecast(data.forecast);
        this.fetchBackgroundImage(city);
      })
      .catch((error) => this.handleFetchError(error));
  },

  displayWeather: function (data) {
    const { name, timezone } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const temperature = isMetric ? temp + "°C" : temp + "°F";
    const windSpeed = isMetric
      ? speed + " km/h"
      : (speed * 0.621371).toFixed(1) + " mph";

    const localTime = this.getLocalTime(timezone);
    document.querySelector(".local-time").innerText =
      "Local Time: " + localTime;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temperature;
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + windSpeed;

    document.querySelector(".weather").classList.remove("loading");
    document.querySelector(".weather").classList.remove("hidden");

    document.querySelector(".toggle-units").classList.remove("hidden");
  },

  displayHourlyForecast: function (data) {
    const hourlyData = data.list.slice(0, 6);

    const hourlyForecast = document.querySelector(".hourly-forecast");
    hourlyForecast.innerHTML = "";

    hourlyData.forEach((item) => {
      const time = new Date(item.dt * 1000).getHours() + ":00";
      const temp = Math.round(item.main.temp) + (isMetric ? "°C" : "°F");
      const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

      const hourlyItem = document.createElement("div");
      hourlyItem.classList.add("hourly-item");
      hourlyItem.innerHTML = `
        <img src="${icon}" alt="Weather Icon">
        <span>${time}</span>
        <span>${temp}</span>
      `;
      hourlyForecast.appendChild(hourlyItem);
    });
  },

  fetchBackgroundImage: function (city) {
    fetch(`/background?city=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const imageUrl = data.results[0].urls.full;
          document.body.style.backgroundImage = `url(${imageUrl})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
        } else {
          console.error("No image found for this city.");
        }
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  },

  handleFetchError: function (error) {
    const errorMessageElement = document.querySelector(".error-message");
    errorMessageElement.innerText = "Error: " + error.message;
    errorMessageElement.style.color = "red";
    document.querySelector(".weather").classList.remove("loading");
  },

  getLocalTime: function (utcOffset) {
    const offsetMilliseconds = utcOffset * 1000;
    const localTime = new Date(Date.now() + offsetMilliseconds);
    const options = { hour: "numeric", minute: "numeric" };

    if (!isNaN(localTime)) {
      const formattedLocalTime = localTime.toLocaleTimeString("en-US", options);
      return formattedLocalTime;
    } else {
      console.error("Error getting local time: Invalid date");
      return "N/A";
    }
  },

  search: function () {
    const city = document.querySelector(".search-bar").value;

    if (city.trim() !== "") {
      this.fetchWeather(city);
    }
  },

  toggleUnits: function () {
    const city = document.querySelector(".search-bar").value;

    if (city.trim() !== "") {
      isMetric = !isMetric;
      this.fetchWeather(city);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".toggle-units");
  const searchInput = document.querySelector(".search-bar");

  toggleButton.classList.add("hidden");

  function showToggleButton() {
    toggleButton.classList.remove("hidden");
  }

  document
    .querySelector(".search button")
    .addEventListener("click", function () {
      weather.search();
      showToggleButton();
    });

  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
      showToggleButton();
    }
  });

  toggleButton.addEventListener("click", function () {
    weather.toggleUnits();
  });
});
