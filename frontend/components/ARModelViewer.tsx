'use client'

import { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

function ModelScene({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 1 / maxDim
    scene.scale.setScalar(scale * 2)

    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center.multiplyScalar(scale * 2))
  }, [scene])

  return <primitive object={scene} />
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-white border-t-transparent" />
        <span className="text-white text-sm mt-2">加载中...</span>
      </div>
    </Html>
  )
}

interface InteractiveModelProps {
  modelUrl: string
  modelName: string
  onScaleChange: (scale: number) => void
}

function InteractiveModel({ modelUrl, modelName, onScaleChange }: InteractiveModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const lastTouchRef = useRef({ distance: 0, centerX: 0, centerY: 0 })

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
  })

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (touches: TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    }
  }

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation()
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.3), 5)
    setScale(newScale)
    onScaleChange(newScale)
  }, [scale, onScaleChange])

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    canvas.addEventListener('wheel', handleWheel, { passive: false })

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchRef.current.distance = getTouchDistance(e.touches)
        const center = getTouchCenter(e.touches)
        lastTouchRef.current.centerX = center.x
        lastTouchRef.current.centerY = center.y
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        e.stopPropagation()
        const currentDistance = getTouchDistance(e.touches)
        const scaleFactor = currentDistance / lastTouchRef.current.distance
        const newScale = Math.min(Math.max(scale * scaleFactor, 0.3), 5)
        setScale(newScale)
        onScaleChange(newScale)
        lastTouchRef.current.distance = currentDistance
      }
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [scale, onScaleChange, handleWheel])

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <ModelScene url={modelUrl} />
      </Suspense>
    </group>
  )
}

interface ARModelViewerProps {
  modelUrl: string
  modelName: string
}

export default function ARModelViewer({ modelUrl, modelName }: ARModelViewerProps) {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null)
  const [modelScale, setModelScale] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const lastMouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setIsARSupported(supported))
        .catch(() => setIsARSupported(false))
    } else {
      setIsARSupported(false)
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    lastMouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastMouseRef.current.x
    const deltaY = e.clientY - lastMouseRef.current.y
    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01
    }))
    lastMouseRef.current = { x: e.clientX, y: e.clientY }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const startAR = async () => {
    if (isARSupported) {
      try {
        await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay']
        })
      } catch (err) {
        console.error('Failed to start AR session:', err)
        setIsARSupported(false)
      }
    }
  }

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <Canvas
        camera={{ fov: 50, position: [0, 0, 3] }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', touchAction: 'none' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <InteractiveModel
          modelUrl={modelUrl}
          modelName={modelName}
          onScaleChange={setModelScale}
        />
      </Canvas>

      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="text-white text-sm font-bold">{modelName}</div>
          <div className="text-white/60 text-xs">3D 交互模型</div>
        </div>

        {isARSupported && (
          <button
            onClick={startAR}
            className="bg-gold hover:bg-gold-light text-wood-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            📱 启动 AR
          </button>
        )}
      </div>

      <div className="absolute bottom-6 left-4 right-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm flex justify-center gap-6">
          <span>🖱️ 拖动旋转</span>
          <span>🔍 滚轮缩放</span>
          <span>🤏 双指缩放</span>
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/50 rounded-full px-3 py-1">
          <span className="text-white text-xs">缩放: {Math.round(modelScale * 100)}%</span>
        </div>
      </div>

      <a
        href="/ar"
        className="absolute top-4 right-32 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm hover:bg-black/90 transition-colors z-10"
      >
        ← 返回
      </a>
    </div>
  )
}
