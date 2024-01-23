let isMetric = true;

let weather = {
  apiKey: "e9ee00dae53fe669f88da411fdbdb25c",

  fetchWeather: function(city) {
    // Display loading message
    document.querySelector(".weather").classList.add("loading");
    document.querySelector(".error-message").innerText = "";

    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=" +
        (isMetric ? "metric" : "imperial") +
        "&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => this.handleFetchError(error));
  },

  displayWeather: function(data) {
    const { name, timezone } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const temperature = isMetric
      ? temp + "°C"
      : ((temp * 9) / 5 + 32).toFixed(1) + "°F";
    const windSpeed = isMetric
      ? speed + " km/h"
      : (speed * 0.621371).toFixed(1) + " mph";

    // Display local time
    const localTime = this.getLocalTime(timezone);
    document.querySelector(".local-time").innerText = "Local Time: " + localTime;


    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temperature;
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + windSpeed;

    // Set background image
    const backgroundImageUrl = 'https://source.unsplash.com/1600x900/?' + name;
    document.body.style.backgroundImage = "url('" + backgroundImageUrl + "')";

    // Remove loading class
    document.querySelector(".weather").classList.remove("loading");
  },

handleFetchError: function(error) {
  // Display error message 
  const errorMessageElement = document.querySelector(".error-message");
  errorMessageElement.innerText = "Error : " + error.message;
  errorMessageElement.style.color = "red";

  // Remove loading class
  document.querySelector(".weather").classList.remove("loading");
},

 getLocalTime: function(utcOffset) {
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

  search: function() {
    const city = document.querySelector(".search-bar").value;

    if (city.trim() !== "") {
      this.fetchWeather(city);
    }
  },

  toggleUnits: function() {
    const city = document.querySelector(".search-bar").value;

    if (city.trim() !== "") {
      isMetric = !isMetric;
      this.fetchWeather(city);
    }
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});

document
  .querySelector(".toggle-units")
  .addEventListener("click", function () {
    weather.toggleUnits();
  });


weather.fetchWeather("Denver");