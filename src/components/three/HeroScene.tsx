"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import * as THREE from "three"

function ResumeDocument({ position, rotation, color, speed = 1 }: any) {
  const meshRef = React.useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.15
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2 * speed) * 0.08
    }
  })

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <boxGeometry args={[0.7, 1, 0.02]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Lines on document */}
      {[0.3, 0.15, 0, -0.15, -0.3].map((y, i) => (
        <mesh key={i} position={[position[0], position[1] + y, position[2] + 0.015]}>
          <boxGeometry args={[0.4 - i * 0.03, 0.02, 0.001]} />
          <meshStandardMaterial color={color} transparent opacity={0.08 + i * 0.02} />
        </mesh>
      ))}
    </Float>
  )
}

function NeuralNode({ position, connections }: { position: [number, number, number]; connections: [number, number, number][] }) {
  const ref = React.useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2
      ref.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Glow sphere */}
      <mesh position={position}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#34d399" transparent opacity={0.1} />
      </mesh>
      {/* Connections */}
      {connections.map((target, i) => (
        <ConnectionLine key={i} start={position} end={target} />
      ))}
    </group>
  )
}

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const ref = React.useRef<THREE.Line>(null)

  const points = React.useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  const geometry = React.useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    return g
  }, [points])

  const lineObj = React.useMemo(() => {
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.12 }))
  }, [geometry])

  return <primitive ref={ref} object={lineObj} />
}

function OrbitalRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = React.useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed
      ref.current.rotation.x = Math.PI / 3
    }
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.005, 8, 100]} />
      <meshStandardMaterial color={color} transparent opacity={0.15} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

function HeroSphere() {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere args={[1.2, 64, 64]} position={[0, 0, -2]}>
        <MeshDistortMaterial
          color="#0a1a14"
          emissive="#34d399"
          emissiveIntensity={0.08}
          roughness={0.8}
          metalness={0.2}
          distort={0.3}
          speed={1.5}
          transparent
          opacity={0.5}
        />
      </Sphere>
    </Float>
  )
}

function Scene() {
  const groupRef = React.useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const neuralNodes: [number, number, number][] = [
    [-3, 2, -4], [-2, -1, -3], [3, 1.5, -5], [2, -2, -4],
    [-1, 3, -6], [4, 0, -3], [-4, -1, -5], [1, -3, -4],
    [0, 2.5, -5], [-3, 0, -6],
  ]

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#34d399" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#059669" />
      <pointLight position={[0, 3, 2]} intensity={0.2} color="#22d3ee" />

      <HeroSphere />
      
      {/* Orbital rings */}
      <OrbitalRing radius={2.5} speed={0.2} color="#34d399" />
      <OrbitalRing radius={3.2} speed={-0.15} color="#059669" />
      <OrbitalRing radius={4} speed={0.1} color="#22d3ee" />

      {/* Floating resume documents */}
      <ResumeDocument position={[-3, 1.5, -2]} rotation={[0.1, 0.3, -0.1]} color="#34d399" speed={1} />
      <ResumeDocument position={[3.5, -0.5, -3]} rotation={[-0.1, -0.2, 0.05]} color="#059669" speed={0.7} />
      <ResumeDocument position={[-2, -2, -4]} rotation={[0.05, 0.15, 0.1]} color="#22d3ee" speed={1.2} />

      {/* Neural network nodes */}
      {neuralNodes.map((pos, i) => (
        <NeuralNode
          key={i}
          position={pos}
          connections={neuralNodes.filter((_, j) => {
            const dx = pos[0] - neuralNodes[j][0]
            const dy = pos[1] - neuralNodes[j][1]
            return j !== i && Math.sqrt(dx * dx + dy * dy) < 3.5
          }).slice(0, 2)}
        />
      ))}
    </group>
  )
}

export default function HeroScene() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a1a14] via-[#0a1230] to-[#0a1a14]" />
  }

  return (
    <div className="absolute inset-0 z-0">
      <React.Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-[#0a1a14] via-[#0a1230] to-[#0a1a14]" />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </React.Suspense>
    </div>
  )
}
