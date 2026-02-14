import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { Earth } from './Earth'
import { Markers } from './Markers'

export function Scene({ onMarkerClick, layers }) {
    const [isInteracting, setIsInteracting] = useState(false)

    return (
        <div className="w-full h-full absolute top-0 left-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <color attach="background" args={['#000000']} />
                <Suspense fallback={
                    <Html center>
                        <div className="text-white font-mono text-xl animate-pulse">LOADING PLANETARY ASSETS...</div>
                    </Html>
                }>
                    <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.5} />
                    <Earth isInteracting={isInteracting} layers={layers}>
                        {layers.events && <Markers radius={2.52} onSelect={onMarkerClick} />}
                    </Earth>
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        zoomSpeed={0.6}
                        panSpeed={0.5}
                        rotateSpeed={0.4}
                        onStart={() => setIsInteracting(true)}
                        onEnd={() => setIsInteracting(false)}
                    />
                </Suspense>
            </Canvas>
        </div>
    )
}
