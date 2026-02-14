import React, { useState, useEffect, useMemo } from 'react'
import { latLonToVector3 } from '../utils/coordinates'
import { Html } from '@react-three/drei'

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
        return events.map(d => ({
            ...d,
            color: CATEGORY_COLORS[d.categoryId] || CATEGORY_COLORS['default'],
            position: latLonToVector3(d.lat, d.lon, radius)
        }))
    }, [events, radius])

    return (
        <group>
            {displayData.map((marker) => (
                <group key={marker.id} position={marker.position} onClick={(e) => {
                    e.stopPropagation()
                    onSelect(marker)
                }}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                    {/* Glowing dot */}
                    <mesh>
                        <sphereGeometry args={[0.02, 16, 16]} />
                        <meshBasicMaterial color={marker.color} toneMapped={false} />
                    </mesh>
                    {/* Light emitter */}
                    <pointLight color={marker.color} distance={0.5} intensity={2} />

                    {/* Label (only show on hover logic could be added, but for now transparent) */}
                    <mesh scale={[1.2, 1.2, 1.2]}>
                        <sphereGeometry args={[0.02, 16, 16]} />
                        <meshBasicMaterial color={marker.color} transparent opacity={0.3} toneMapped={false} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}
