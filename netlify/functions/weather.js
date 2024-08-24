import fetch from "node-fetch";

export async function handler(event) {
  const city = event.queryStringParameters.city;
  const units = event.queryStringParameters.units || "metric";
  const WEATHER_API_KEY = "e9ee00dae53fe669f88da411fdbdb25c";

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${WEATHER_API_KEY}`
    );
    if (!weatherResponse.ok) throw new Error("City not found");
    const weatherData = await weatherResponse.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${WEATHER_API_KEY}`
    );
    const forecastData = await forecastResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ weather: weatherData, forecast: forecastData }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
