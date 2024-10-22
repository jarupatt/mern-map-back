const axios = require("axios");
const HttpError = require("../models/http-errors");

require("dotenv").config()

const API_KEY = process.env.API_KEY;

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${API_KEY}`
  );

  const data = response.data;

  // Check if features array is empty
  if (!data || data.features.length === 0) {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  // Get the coordinates from the first result
  const coordinates = data.features[0].geometry.coordinates;
  return {
    lat: coordinates[1], // Latitude comes second in Mapbox's coordinates
    lng: coordinates[0], // Longitude comes first
  };
}

module.exports = getCoordsForAddress;