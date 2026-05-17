'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Grid, ScrollControls, useScroll } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

function CarBody({ scrollProgress }: { scrollProgress: number }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    // Subtle idle animation
    group.current.position.y = Math.sin(t * 0.5) * 0.02
    // Rotate based on scroll
    group.current.rotation.y = scrollProgress * Math.PI * 0.5
  })

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#c11a26',
        metalness: 1.0,
        roughness: 0.42,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      }),
    []
  )

  const chromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b8b8b8',
        metalness: 1.0,
        roughness: 0.35,
      }),
    []
  )

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0a0608',
        metalness: 0.25,
        roughness: 0.0,
        transmission: 0.85,
        transparent: true,
        opacity: 0.55,
      }),
    []
  )

  return (
    <group ref={group} position={[0, 0.4, 0]}>
      {/* Main body - stylized low-poly sports car */}
      <mesh material={bodyMaterial} castShadow>
        <boxGeometry args={[2.2, 0.6, 4.5]} />
      </mesh>
      {/* Cabin */}
      <mesh material={glassMaterial} position={[0, 0.55, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.5, 2.0]} />
      </mesh>
      {/* Hood scoop */}
      <mesh material={bodyMaterial} position={[0, 0.35, 1.5]} castShadow>
        <boxGeometry args={[1.0, 0.15, 1.2]} />
      </mesh>
      {/* Rear spoiler */}
      <mesh material={bodyMaterial} position={[0, 0.85, -2.0]} castShadow>
        <boxGeometry args={[1.8, 0.08, 0.4]} />
      </mesh>
      <mesh material={chromeMaterial} position={[0.8, 0.65, -2.0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.25]} />
      </mesh>
      <mesh material={chromeMaterial} position={[-0.8, 0.65, -2.0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.25]} />
      </mesh>
      {/* Wheels */}
      {[
        [-1.1, -0.2, 1.4],
        [1.1, -0.2, 1.4],
        [-1.1, -0.2, -1.4],
        [1.1, -0.2, -1.4],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.6} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, pos[0] > 0 ? 0.05 : -0.05]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
            <meshStandardMaterial color="#b8b8b8" metalness={1.0} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Headlights */}
      <mesh position={[-0.6, 0.15, 2.26]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshStandardMaterial color="#fff2d8" emissive="#fff2d8" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.6, 0.15, 2.26]}>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshStandardMaterial color="#fff2d8" emissive="#fff2d8" emissiveIntensity={2} />
      </mesh>
      {/* Taillights */}
      <mesh position={[-0.7, 0.2, -2.26]}>
        <boxGeometry args={[0.4, 0.1, 0.05]} />
        <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.7, 0.2, -2.26]}>
        <boxGeometry args={[0.4, 0.1, 0.05]} />
        <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight color="#3a1a22" intensity={0.85} />
      <hemisphereLight color="#5a2a32" groundColor="#1a0a0c" intensity={0.55} />
      
      {/* Key white light from front-right */}
      <spotLight
        color="#fff2e0"
        intensity={60}
        position={[7, 8, 7]}
        target-position={[0, 0.8, 0]}
        angle={Math.PI / 4}
        penumbra={0.4}
        decay={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Red key from above-left */}
      <spotLight
        color="#e63946"
        intensity={36}
        position={[-7, 9, 4]}
        target-position={[0, 0.6, 0]}
        angle={Math.PI / 5}
        penumbra={0.55}
        decay={1.2}
      />
      
      {/* Cool blue rim from back-right */}
      <spotLight
        color="#3a7bd5"
        intensity={22}
        position={[7, 6, -3]}
        target-position={[0, 0.6, 0]}
        angle={Math.PI / 4}
        penumbra={0.7}
        decay={1.3}
      />
      
      {/* Warning puddle from below-back */}
      <pointLight color="#c11a26" intensity={9} position={[-2, 0.6, -3]} decay={2} distance={14} />
      
      {/* Top fill */}
      <directionalLight color="#ffe9d6" intensity={0.65} position={[2, 12, 5]} />
      
      {/* Underglow */}
      <pointLight color="#e63946" intensity={4} position={[0, 0.05, 0]} decay={2} distance={5} />
    </>
  )
}

function Floor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0a0608" roughness={0.42} metalness={0.75} transparent opacity={0.6} />
      </mesh>
      <Grid
        position={[0, 0.001, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1a0a0d"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#6b0f15"
        fadeDistance={40}
        fadeStrength={1}
        infiniteGrid
      />
    </>
  )
}

function CeilingStrips() {
  const stripMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fff2d8',
        emissive: '#ffe0b0',
        emissiveIntensity: 1.4,
      }),
    []
  )

  return (
    <>
      {[-3, -1, 1, 3].map((i) => (
        <mesh key={i} material={stripMat} position={[0, 8.5, i * 1.8]}>
          <boxGeometry args={[16, 0.12, 0.25]} />
        </mesh>
      ))}
    </>
  )
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <fog attach="fog" args={['#0a0407', 10, 40]} />
      <color attach="background" args={['#050207']} />
      
      <Lighting />
      <CarBody scrollProgress={scrollProgress} />
      <Floor />
      <CeilingStrips />
      
      <Environment preset="city" />
      
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}

export function LandingScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas
      camera={{ position: [8.5, 2.5, 5], fov: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: '#050207' }}
    >
      <Scene scrollProgress={scrollProgress} />
    </Canvas>
  )
}
