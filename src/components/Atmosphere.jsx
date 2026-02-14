import React from 'react'
import * as THREE from 'three'

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition; // View space position (camera at 0,0,0)

void main() {
  // View direction is from camera (0,0,0) to fragment (vPosition), normalized.
  // Actually, since we want direction TO the camera, it is -vPosition.
  // But wait, in view space, camera is at origin looking down -Z? 
  // Standard Fresnel: dot(N, V) where V is vector TO eye.
  
  vec3 viewDirection = normalize(-vPosition); // Vector from surface to camera
  vec3 normal = normalize(vNormal);

  // Calculate intensity: Higher at edges (dot product close to 0)
  // 1.0 - dot(N, V) approaches 1.0 at edge.
  // We use a coefficient to offset the start of the glow.
  
  float fresnel = dot(normal, viewDirection);
  float intensity = pow(0.65 - fresnel, 3.0); 

  // Clamp to avoid negative values causing artifacts (though BackSide handles visibility)
  // Actually, for BackSide atmosphere, we are seeing the "far" side. 
  // The dot product might behave differently depending on winding.
  // Let's stick to the visual result logic: 
  // If "weird edge", likely the sharp falloff or negative power base.
  
  intensity = max(0.0, intensity);

  gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity * 1.5;
}
`

export function Atmosphere() {
    return (
        <mesh scale={[1.15, 1.15, 1.15]}>
            <sphereGeometry args={[2.5, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    )
}
