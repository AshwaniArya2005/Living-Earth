import * as THREE from 'three'

/**
 * Converts Lat/Lon to 3D Cartesian coordinates on a sphere.
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @param {number} radius - Radius of the sphere
 * @returns {THREE.Vector3}
 */
export function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const z = (radius * Math.sin(phi) * Math.sin(theta))
    const y = (radius * Math.cos(phi))

    return new THREE.Vector3(x, y, z)
}
