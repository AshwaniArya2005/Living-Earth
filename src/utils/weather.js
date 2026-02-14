
/**
 * Fetches current weather data for a specific location using Open-Meteo API.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - Weather data object
 */
export async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`
        );
        const data = await response.json();
        return data.current;
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return null;
    }
}
