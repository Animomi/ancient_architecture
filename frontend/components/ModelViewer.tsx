'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  useGLTF,
  Html
} from '@react-three/drei'
import * as THREE from 'three'

interface ModelData {
  center: THREE.Vector3
  size: THREE.Vector3
}

function ModelScene({ url, onReady }: { 
  url: string
  onReady: (data: ModelData) => void
}) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    if (!box.isEmpty()) {
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      box.getCenter(center)
      box.getSize(size)
      
      const distance = Math.max(size.x, size.y, size.z) * 2
      camera.position.set(center.x + distance, center.y + distance * 0.5, center.z + distance)
      camera.lookAt(center)

      if (controlsRef.current) {
        controlsRef.current.target.copy(center)
        controlsRef.current.update()
      }

      onReady({ center, size })
    }
  }, [scene, camera, onReady])

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <>
      <primitive ref={groupRef} object={scene} />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
        minDistance={0.5}
        maxDistance={100}
        enableDamping={true}
        dampingFactor={0.1}
      />
    </>
  )
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
        <p className="text-cream/80 mt-4">正在加载...</p>
      </div>
    </Html>
  )
}

interface ModelViewerProps {
  modelUrl: string
  autoRotate?: boolean
  enableControls?: boolean
  className?: string
}

export default function ModelViewer({
  modelUrl,
  autoRotate = false,
  className = 'w-full h-full'
}: ModelViewerProps) {
  const [modelData, setModelData] = useState<ModelData | null>(null)

  return (
    <div className={className}>
      <Canvas
        camera={{ fov: 50 }}
        shadows
        gl={{ antialias: true }}
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ModelScene url={modelUrl} onReady={setModelData} />
        </Suspense>
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      </Canvas>
    </div>
  )
}
