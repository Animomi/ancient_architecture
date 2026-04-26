'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

function ModelScene({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold border-t-transparent" />
    </Html>
  )
}

interface ARModelViewerProps {
  modelUrl: string
  className?: string
}

export default function ARModelViewer({ modelUrl, className = 'w-64 h-64' }: ARModelViewerProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ fov: 50, position: [0, 0, 5] }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelScene url={modelUrl} />
        </Suspense>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
      </Canvas>
    </div>
  )
}
