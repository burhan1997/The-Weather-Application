import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const app = express();
const PORT = 3000;

const WEATHER_API_KEY = "e9ee00dae53fe669f88da411fdbdb25c";
const UNSPLASH_API_KEY = "Z0NwQqBxWAi9BFXmK9rc4ihrH7KSUS3dKCEEtHLWF0E";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const units = req.query.units || "metric";

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

    res.json({ weather: weatherData, forecast: forecastData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/background", async (req, res) => {
  const city = req.query.city;
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=1`
    );
    if (!response.ok) throw new Error("Failed to fetch background image");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
