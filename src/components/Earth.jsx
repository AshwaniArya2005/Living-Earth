import React, { useRef, useEffect, useMemo } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

import DayMap from '../assets/textures/earth_daymap_8k.jpg'
import NightMap from '../assets/textures/earth_nightmap_8k.jpg'
import NormalMap from '../assets/textures/earth_normal.jpg'
import SpecularMap from '../assets/textures/earth_specular.jpg'
import CloudsMap from '../assets/textures/earth_clouds_8k.jpg'
import { Atmosphere } from './Atmosphere'

// Custom Shader for Day/Night Cycle
const EarthMaterial = {
    uniforms: {
        dayTexture: { value: null },
        nightTexture: { value: null },
        normalTexture: { value: null },
        specularTexture: { value: null },
        cloudsTexture: { value: null },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) }
    },
    vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      // Calculate world normal for lighting
      vNormal = normalize(mat3(modelMatrix) * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * viewMatrix * vec4(vPosition, 1.0);
    }`,
    fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D normalTexture;
    uniform sampler2D specularTexture;
    uniform sampler2D cloudsTexture;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vPosition);
      
      // Calculate light intensity (Sun is a directional light)
      float sunDot = dot(normalize(vNormal), normalize(sunDirection));
      
      // Day/Night Mix Factor
      // smoothstep(min, max, value): 
      // < min = 0 (Night)
      // > max = 1 (Day)
      float mixFactor = smoothstep(-0.25, 0.25, sunDot);

      // Sample Textures
      vec4 dayColor = texture2D(dayTexture, vUv);
      vec4 nightColor = texture2D(nightTexture, vUv);
      vec4 specMap = texture2D(specularTexture, vUv);
      vec4 clouds = texture2D(cloudsTexture, vUv);

      // Night Lights Color
      vec3 finalNight = nightColor.rgb * vec3(2.2, 1.6, 1.0); 

      // Clouds:
      // 1. Occlude Night Lights: Clouds block city lights
      float cloudMix = clouds.r;
      finalNight *= (1.0 - cloudMix * 0.95);

      // Specular Reflection (Oceans)
      // Only distinct on the day side
      vec3 reflectDir = reflect(-normalize(sunDirection), vNormal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      vec3 specular = vec3(0.5) * spec * specMap.r * mixFactor;

      // Mix Day and Night
      vec3 diffuse = mix(finalNight, dayColor.rgb, mixFactor);

      // 2. Add Day Clouds (White)
      // Only visible when lit by sun (mixFactor > 0)
      vec3 finalColor = mix(diffuse, vec3(1.0), cloudMix * mixFactor * 0.9);

      gl_FragColor = vec4(finalColor + vec3(spec), 1.0);
    }`
}

export function Earth({ children, isInteracting, layers }) {
    const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [DayMap, NightMap, NormalMap, SpecularMap, CloudsMap])
    const { gl, camera, scene } = useThree()
    const materialRef = useRef()

    // Improve texture sharpness
    useMemo(() => {
        [dayMap, nightMap, normalMap, specularMap, cloudsMap].forEach(t => {
            t.anisotropy = gl.capabilities.getMaxAnisotropy()
        })
    }, [dayMap, nightMap, normalMap, specularMap, cloudsMap])

    const groupRef = useRef()

    // Calculate Real Sun Position (Simplified)
    const getRealTimeRotation = () => {
        const now = new Date()
        const hours = now.getUTCHours()
        const minutes = now.getUTCMinutes()
        const totalHours = hours + minutes / 60
        // Calculate rotation angle: (Hours - 12) * 15 degrees converted to radians
        // 12:00 -> 0 deg. 18:00 -> 90 deg.
        return (totalHours - 12) * (Math.PI / 12)
    }

    useFrame(({ clock }) => {
        if (!materialRef.current) return

        // Sun Direction is fixed in World Space (e.g. from Right)
        const sunDir = new THREE.Vector3(10, 0, 2).normalize() // Slightly forward to light up front face a bit more
        materialRef.current.uniforms.sunDirection.value.copy(sunDir)

        // Manual Rotation or Realtime
        if (isInteracting) {
            // Manual control
        } else {
            if (groupRef.current) {
                groupRef.current.rotation.y += 0.0005
            }
        }
    })

    // Set initial rotation
    useEffect(() => {
        if (groupRef.current) {
            // For "Real Time", we set the Y rotation.
            // But verify coordinates: Living Earth likely uses standard texture where 0,0 is center.
            // We adjust so 0 lon is facing Z or X?.
            // Usually texture center is 0 lon.
            // We want 0 lon to face Sun (X=10) at 12:00.
            // So at 12:00, rotation should be -90 deg? depending on axis.
            // Let's just approximate start.
            const rot = getRealTimeRotation()
            // groupRef.current.rotation.y = rot // Uncomment for strict real time start
        }
    }, [])

    return (
        <group>
            <ambientLight intensity={0.1} /> {/* Low ambient for deep space feel */}
            <pointLight position={[10, 0, 0]} intensity={2.0} /> {/* Sun */}

            <group ref={groupRef}>
                <mesh scale={[1, 1, 1]}>
                    <sphereGeometry args={[2.5, 64, 64]} />
                    <shaderMaterial
                        ref={materialRef}
                        uniforms={{
                            dayTexture: { value: dayMap },
                            nightTexture: { value: nightMap },
                            normalTexture: { value: normalMap },
                            specularTexture: { value: specularMap },
                            cloudsTexture: { value: cloudsMap }, // We handle clouds in shader now? Or separate?
                            sunDirection: { value: new THREE.Vector3(1, 0, 0) }
                        }}
                        vertexShader={EarthMaterial.vertexShader}
                        fragmentShader={EarthMaterial.fragmentShader}
                    />
                </mesh>

                {/* Markers */}
                {children}
            </group>

            <Atmosphere />
        </group>
    )
}

