"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshTransmissionMaterial } from "@react-three/drei"
import * as THREE from "three"

function ResumeSheet({ position, rotation, color, opacity = 0.3 }: {
  position: [number, number, number]; rotation: [number, number, number]; color: string; opacity?: number
}) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05
      meshRef.current.rotation.x = rotation[0] + Math.cos(state.clock.elapsedTime * 0.2) * 0.03
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <planeGeometry args={[1.2, 1.6]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
    </Float>
  )
}

function NeuralNode({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2)
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  )
}

function NeuralConnection({ start, end, color }: {
  start: [number, number, number]; end: [number, number, number]; color: string
}) {
  const lineRef = React.useRef<THREE.Line>(null)
  
  React.useEffect(() => {
    if (lineRef.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
      ])
      lineRef.current.geometry = geometry
    }
  }, [start, end])

  return (
    <line ref={lineRef as any}>
      <bufferGeometry />
      <lineBasicMaterial color={color} transparent opacity={0.15} />
    </line>
  )
}

function DataParticles({ count = 60 }: { count?: number }) {
  const meshRef = React.useRef<THREE.InstancedMesh>(null)
  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 8,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }))
  }, [count])

  useFrame((state) => {
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.5,
        p.y + Math.cos(state.clock.elapsedTime * p.speed * 0.7 + p.offset) * 0.3,
        p.z
      )
      dummy.scale.setScalar(0.3 + Math.sin(state.clock.elapsedTime * 2 + p.offset) * 0.15)
      dummy.updateMatrix()
      meshRef.current?.setMatrixAt(i, dummy.matrix)
    })
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
    </instancedMesh>
  )
}

function Scene() {
  const nodes: [number, number, number][] = [
    [-3, 2, -1], [-2, 0.5, 0], [-1, -1, -2], [0, 1.5, -1],
    [1, -0.5, 0], [2, 1, -1.5], [3, -1, -0.5], [0, -2, -1],
    [-2.5, -1.5, -0.5], [2.5, 2, -2],
  ]

  const connections: [[number, number, number], [number, number, number]][] = [
    [nodes[0], nodes[1]], [nodes[1], nodes[2]], [nodes[1], nodes[3]],
    [nodes[3], nodes[4]], [nodes[4], nodes[5]], [nodes[5], nodes[6]],
    [nodes[2], nodes[7]], [nodes[0], nodes[8]], [nodes[5], nodes[9]],
    [nodes[3], nodes[5]], [nodes[7], nodes[4]],
  ]

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#34d399" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#059669" />
      <pointLight position={[0, -5, 5]} intensity={0.3} color="#22d3ee" />
      <spotLight position={[0, 8, 4]} angle={0.3} penumbra={1} intensity={0.5} color="#34d399" />

      {/* Floating Resume Sheets */}
      <ResumeSheet position={[-3.5, 1.5, -2]} rotation={[0.1, 0.3, 0]} color="#34d399" opacity={0.2} />
      <ResumeSheet position={[3, -0.5, -3]} rotation={[-0.1, -0.2, 0.05]} color="#059669" opacity={0.15} />
      <ResumeSheet position={[0, 2.5, -4]} rotation={[0.05, 0.15, -0.05]} color="#22d3ee" opacity={0.12} />
      <ResumeSheet position={[-1, -2, -2.5]} rotation={[0.2, -0.1, 0.1]} color="#6366f1" opacity={0.1} />

      {/* Neural Network */}
      {nodes.map((pos, i) => (
        <NeuralNode key={`node-${i}`} position={pos} color={i % 3 === 0 ? "#34d399" : i % 3 === 1 ? "#059669" : "#22d3ee"} />
      ))}
      {connections.map(([start, end], i) => (
        <NeuralConnection key={`conn-${i}`} start={start} end={end} color="#4060ff" />
      ))}

      {/* Data Particles */}
      <DataParticles count={80} />
    </>
  )
}

export default function HeroScene() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#0a1a14]" />
  }

  return (
    <div className="absolute inset-0 z-0">
      <React.Suspense fallback={<div className="absolute inset-0 bg-[#0a1a14]" />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </React.Suspense>
    </div>
  )
}
