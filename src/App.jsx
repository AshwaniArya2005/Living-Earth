import React, { useState } from 'react'
import { Scene } from './components/Scene'
import { UI } from './components/UI'

function App() {
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [layers, setLayers] = useState({ clouds: true, events: true })

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  const handleReset = () => {
    // We'll pass a signal or use a ref to reset camera, but for now simple refresh is enough or we wire it up later.
    // Actually, let's just log it for now as "Projection" usually implies Map View vs Globe.
    console.log("Reset View")
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Scene
          onMarkerClick={setSelectedMarker}
          layers={layers}
        />
      </div>
      <UI
        selectedMarker={selectedMarker}
        layers={layers}
        onLayerToggle={toggleLayer}
        onReset={handleReset}
        onCloseInfo={() => setSelectedMarker(null)}
      />
    </div>
  )
}

export default App
