
/**
 * Generates a simulated AI analysis report based on the event type and real weather data.
 * @param {Object} event - The selected event object
 * @param {Object} weather - Real-time weather data from Open-Meteo (optional)
 * @returns {Object} - Contains summary, stats, and status
 */
export function generateEventAnalysis(event, weather) {
    const type = event.type.toLowerCase()

    // Default values if weather fetch fails
    const w = weather || {
        temperature_2m: 20,
        wind_speed_10m: 15,
        surface_pressure: 1013,
        relative_humidity_2m: 50
    }

    let analysis = {
        summary: "Analyzing data stream...",
        stats: [],
        status: "PROCESSING"
    }

    // Dynamic text based on real values
    const windText = w.wind_speed_10m > 40 ? "High velocity winds detected, exacerbating conditions." : "Wind patterns are currently stable.";
    const pressureText = w.surface_pressure < 1000 ? "Low pressure system contributing to instability." : "Barometric pressure remains nominal.";
    const tempText = w.temperature_2m > 30 ? "Extreme heat signatures observed." : w.temperature_2m < 0 ? "Sub-zero temperatures confirmed." : "Ambient temperature within expected range.";

    if (type.includes('fire')) {
        analysis = {
            summary: `Thermal imaging confirms active combustion. ${tempText} ${windText} Humidity at ${w.relative_humidity_2m}% suggests ${w.relative_humidity_2m < 30 ? "rapid spread potential" : "moderate containment chance"}. Recommendation: Deploy aerial suppressants.`,
            stats: [
                { label: "Wind", value: w.wind_speed_10m.toFixed(1), unit: "km/h" },
                { label: "Temp", value: w.temperature_2m.toFixed(1), unit: "°C" },
                { label: "Humidity", value: w.relative_humidity_2m, unit: "%" }
            ],
            status: w.wind_speed_10m > 30 ? "CRITICAL" : "WARNING"
        }
    } else if (type.includes('ice') || type.includes('sea')) {
        analysis = {
            summary: `Cryospheric assessment initiated. ${tempText} Surface integrity compromised. ${windText} Monitoring drift vectors for navigation hazards.`,
            stats: [
                { label: "Air Temp", value: w.temperature_2m.toFixed(1), unit: "°C" },
                { label: "Pressure", value: w.surface_pressure.toFixed(0), unit: "hPa" },
                { label: "Wind", value: w.wind_speed_10m.toFixed(1), unit: "km/h" }
            ],
            status: w.temperature_2m > 0 ? "MELTING" : "STABLE"
        }
    } else if (type.includes('storm')) {
        analysis = {
            summary: `Meteorological scan complete. ${pressureText} ${windText} Convective available potential energy is rising. Rain bands intensifying.`,
            stats: [
                { label: "Wind", value: w.wind_speed_10m.toFixed(1), unit: "km/h" },
                { label: "Pressure", value: w.surface_pressure.toFixed(0), unit: "hPa" },
                { label: "Precip", value: (Math.random() * 50).toFixed(1), unit: "mm" } // Precip not always in basic free weather API, keeping sim or fetching extra
            ],
            status: w.wind_speed_10m > 80 ? "DANGEROUS" : "TRACKING"
        }
    } else if (type.includes('volcano')) {
        analysis = {
            summary: `Geological disturbance active. ${windText} (Ash plume dispersal vector). Seismic activity correlates with observed thermal anomalies.`,
            stats: [
                { label: "Wind (Ash)", value: w.wind_speed_10m.toFixed(1), unit: "km/h" },
                { label: "Temp", value: w.temperature_2m.toFixed(1), unit: "°C" },
                { label: "SO2 Flux", value: (Math.random() * 1000).toFixed(0), unit: "t/d" }
            ],
            status: "ERUPTION"
        }
    } else {
        analysis = {
            summary: `Global sensor network report. Local conditions: ${w.temperature_2m}°C, ${w.surface_pressure}hPa. ${windText} Data correlation in progress.`,
            stats: [
                { label: "Temp", value: w.temperature_2m.toFixed(1), unit: "°C" },
                { label: "Wind", value: w.wind_speed_10m.toFixed(1), unit: "km/h" },
                { label: "Humidity", value: w.relative_humidity_2m, unit: "%" }
            ],
            status: "ANALYZING"
        }
    }

    return analysis
}
