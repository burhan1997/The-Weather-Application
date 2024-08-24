import fetch from "node-fetch";

export async function handler(event) {
  const city = event.queryStringParameters.city;
  const UNSPLASH_API_KEY = "Z0NwQqBxWAi9BFXmK9rc4ihrH7KSUS3dKCEEtHLWF0E";

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${city}&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=1`
    );
    if (!response.ok) throw new Error("Failed to fetch background image");
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
