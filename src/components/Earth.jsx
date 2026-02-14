import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import DayMap from '../assets/textures/earth_daymap.jpg'
import NormalMap from '../assets/textures/earth_normal.jpg'
import SpecularMap from '../assets/textures/earth_specular.jpg'
import CloudsMap from '../assets/textures/earth_clouds.png'
import { Atmosphere } from './Atmosphere'

export function Earth({ children, isInteracting, layers }) {
    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [DayMap, NormalMap, SpecularMap, CloudsMap])

    // Default layers if not provided
    const showClouds = layers ? layers.clouds : true;

    const groupRef = useRef()
    const cloudsRef = useRef()

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime()

        // Rotate only if not interacting (draging/clicking)
        if (groupRef.current && !isInteracting) {
            groupRef.current.rotation.y += 0.0005
        }

        // Local cloud rotation
        if (showClouds && cloudsRef.current && !isInteracting) {
            cloudsRef.current.rotation.y += 0.0002
        }
    })

    return (
        <group>
            <ambientLight intensity={1.2} />
            <pointLight color="#fff" position={[10, 10, 10]} intensity={2.5} />
            <pointLight color="#4c8bf5" position={[-10, -10, -10]} intensity={0.5} /> {/*  Rim light */}

            <group ref={groupRef}>
                {/* Earth Sphere */}
                <mesh scale={[1, 1, 1]}>
                    <sphereGeometry args={[2.5, 64, 64]} />
                    <meshPhongMaterial specularMap={specularMap} />
                    <meshStandardMaterial
                        map={colorMap}
                        normalMap={normalMap}
                        metalness={0.2}
                        roughness={0.6}
                        emissive="#112244"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* Clouds Layer */}
                {showClouds && (
                    <mesh ref={cloudsRef} scale={[1.005, 1.005, 1.005]}>
                        <sphereGeometry args={[2.53, 64, 64]} />
                        <meshPhongMaterial
                            map={cloudsMap}
                            transparent={true}
                            opacity={0.4}
                            depthWrite={true}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                )}

                {/* Render Markers inside the rotating group so they stick */}
                {children}
            </group>

            <Atmosphere />
        </group>
    )
}

