import React, { useState, useEffect, useMemo } from 'react'
import { latLonToVector3 } from '../utils/coordinates'
import * as THREE from 'three'

// Mapping EONET categories to colors
const CATEGORY_COLORS = {
    8: '#ff5500',   // Wildfires
    10: '#00ffff',  // Storms (Cyan)
    12: '#ff0000',  // Volcanoes
    15: '#ffffff',  // Sea and Lake Ice
    'default': '#ffff00'
}

export function Markers({ radius = 2.5, onSelect }) {
    const [events, setEvents] = useState([])

    useEffect(() => {
        // Fetch last 50 open natural events
        fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events?limit=50&status=open')
            .then(res => res.json())
            .then(data => {
                const processed = data.events.flatMap(ev => {
                    // Get the latest geometry point
                    const geom = ev.geometries[ev.geometries.length - 1]
                    if (!geom || geom.type !== 'Point') return []

                    return {
                        id: ev.id,
                        title: ev.title,
                        type: ev.categories[0].title,
                        categoryId: ev.categories[0].id,
                        lat: geom.coordinates[1],
                        lon: geom.coordinates[0],
                        date: geom.date
                    }
                })
                setEvents(processed)
            })
            .catch(err => console.error("Failed to fetch NASA Data:", err))
    }, [])

    const displayData = useMemo(() => {
        return events.map(d => {
            const position = latLonToVector3(d.lat, d.lon, radius)
            // Calculate rotation to align with surface normal
            const quaternion = new THREE.Quaternion()
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), position.clone().normalize())

            return {
                ...d,
                color: CATEGORY_COLORS[d.categoryId] || CATEGORY_COLORS['default'],
                position,
                quaternion
            }
        })
    }, [events, radius])

    return (
        <group>
            {displayData.map((marker) => (
                <group
                    key={marker.id}
                    position={marker.position}
                    quaternion={marker.quaternion}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect(marker)
                    }}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                    {/* 1. Surface Ring (The "Target") */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
                        <ringGeometry args={[0.03, 0.04, 32]} />
                        <meshBasicMaterial color={marker.color} transparent opacity={0.6} side={THREE.DoubleSide} toneMapped={false} />
                    </mesh>

                    {/* 2. Vertical Pin Line */}
                    <mesh position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.002, 0.002, 0.1, 8]} />
                        <meshBasicMaterial color={marker.color} transparent opacity={0.8} toneMapped={false} />
                    </mesh>

                    {/* 3. The "Head" (Clickable Dot) */}
                    <mesh position={[0, 0.1, 0]}>
                        <sphereGeometry args={[0.015, 16, 16]} />
                        <meshBasicMaterial color={marker.color} toneMapped={false} />
                    </mesh>

                    {/* Glow Sprite/Point for visibility from distance */}
                    <pointLight position={[0, 0.1, 0]} color={marker.color} distance={0.3} intensity={1} />

                    {/* Invisible Hitbox for easier clicking */}
                    <mesh visible={false} position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
                        <meshBasicMaterial color="red" />
                    </mesh>
                </group>
            ))}
        </group>
    )
}
