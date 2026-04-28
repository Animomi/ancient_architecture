'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  useGLTF
} from '@react-three/drei'
import * as THREE from 'three'

function MiniModelScene({ url }: { url: string }) {
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
      
      const distance = Math.max(size.x, size.y, size.z) * 2.5
      camera.position.set(center.x + distance, center.y + distance * 0.8, center.z + distance)
      camera.lookAt(center)

      if (controlsRef.current) {
        controlsRef.current.target.copy(center)
        controlsRef.current.update()
      }
    }
  }, [scene, camera])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  return (
    <>
      <primitive ref={groupRef} object={scene.clone()} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.DOLLY
        }}
        minDistance={1}
        maxDistance={50}
        enableDamping={true}
        dampingFactor={0.05}
        autoRotate={false}
      />
    </>
  )
}

interface MiniModelViewerProps {
  modelUrl: string
}

export default function MiniModelViewer({ modelUrl }: MiniModelViewerProps) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}
      >
        <Suspense fallback={null}>
          <MiniModelScene url={modelUrl} />
        </Suspense>
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} />
        <directionalLight position={[-10, 10, -10]} intensity={0.4} />
        <hemisphereLight intensity={0.3} />
      </Canvas>
    </div>
  )
}
