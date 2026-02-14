# 🌍 Living Earth - 3D Climate Visualization

*A photorealistic, real-time 3D Earth visualization tracking global climate events using NASA's EONET API and Open-Meteo.*

## 🚀 Overview

**Living Earth** creates an immersive "Holographic" view of our planet. It combines high-end WebGL rendering with live data feeds to show wildfires, volcanoes, storms, and sea ice in real-time. It features a day/night cycle synced to real-world time, 8K textures, and a futuristic UI for analyzing environmental data.

## ✨ Key Features

### 🌎 Photorealistic 3D Globe
*   **8K Textures**: Ultra-high resolution Day, Night, Cloud, and Normal maps.
*   **Atmospheric Scattering**: Custom GLSL fragment shaders for a realistic "blue marble" glow.
*   **Day/Night Cycle** 🌗:
    *   **Real-Time Sync**: The sun's position is calculated based on current UTC time.
    *   **Geo-Locked Lighting**: Night falls on the correct continents as the earth spins.
    *   **Dynamic City Lights**: Cities light up automatically on the dark side of the globe.

### 📍 Project Pinpoint Markers
*   **Precision Tracking**: Events are marked with a "Pin & Ring" system for exact location accuracy.
*   **Smart Alignment**: Markers align perfectly with the planet's surface curvature.
*   **Live Data**: Real-time integration with **NASA EONET** (Earth Observatory Natural Event Tracker).

### 📊 Advanced Telemetry & AI
*   **Open-Meteo Integration**: Fetches real-time weather (Wind, Temp, Pressure) for every event location.
*   **AI Analysis Simulation**: Generates context-aware situation reports based on live weather data.
*   **Wind Compass** 🧭: Dynamic gauge showing wind direction and speed.
*   **Threat Level System**: UI pulses Red/Orange/Blue based on event severity and wind conditions.

## 🛠️ Technology Stack

*   **Core**: React 19, Vite
*   **3D Engine**: Three.js, React Three Fiber (R3F)
*   **Helpers**: @react-three/drei
*   **Styling**: TailwindCSS 4, clsx, tailwind-merge
*   **Icons**: Lucide React
*   **Animation**: Framer Motion

## 📦 Installation & Run

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AshwaniArya2005/Living-Earth.git
    cd Living-Earth
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:5173`

5.  **(Optional) Download 8K Textures**:
    Run the included PowerShell script if textures are missing:
    ```powershell
    ./download_textures_v2.ps1
    ```

## 🎮 Controls

*   **Rotate**: Left-Click + Drag
*   **Pan**: Right-Click + Drag
*   **Zoom**: Scroll Wheel
*   **Interact**: Click on any **Pin Marker** to open the Analysis Dashboard.
*   **Pause Rotation**: The Earth pauses automatically when you drag to inspect.

## 📡 Data Sources

*   **Events**: [NASA EONET API v2.1](https://eonet.gsfc.nasa.gov/)
*   **Weather**: [Open-Meteo API](https://open-meteo.com/)
*   **Textures**: [Solar System Scope](https://www.solarsystemscope.com/textures/)

---
*Built with ❤️ by Ashwani Arya*
