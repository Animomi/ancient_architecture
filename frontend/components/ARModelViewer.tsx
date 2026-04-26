'use client'

import { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

function ModelScene({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

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
  const [isDragging, setIsDragging] = useState(false)
  const [isPinching, setIsPinching] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 })

  useFrame(() => {
    if (groupRef.current && !isDragging && !isPinching) {
      groupRef.current.rotation.y += 0.003
    }
  })

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true)
      setIsDragging(false)
      setLastTouchDistance(getTouchDistance(e.touches))
      const center = getTouchCenter(e.touches)
      setLastTouchCenter(center)
    } else {
      setIsDragging(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      const currentDistance = getTouchDistance(e.touches)
      const scaleFactor = currentDistance / lastTouchDistance
      const newScale = Math.min(Math.max(scale * scaleFactor, 0.3), 5)
      setScale(newScale)
      onScaleChange(newScale)
      setLastTouchDistance(currentDistance)

      const currentCenter = getTouchCenter(e.touches)
      const deltaX = (currentCenter.x - lastTouchCenter.x) * 0.01
      const deltaY = (currentCenter.y - lastTouchCenter.y) * 0.01
      setRotation(prev => ({
        x: prev.x + deltaY,
        y: prev.y + deltaX
      }))
      setLastTouchCenter(currentCenter)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsPinching(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setRotation(prev => ({
        x: prev.y + e.movementY * 0.01,
        y: prev.x + e.movementX * 0.01
      }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const newScale = Math.min(Math.max(scale - e.deltaY * 0.001, 0.3), 5)
    setScale(newScale)
    onScaleChange(newScale)
  }

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart as any, { passive: false })
      canvas.addEventListener('touchmove', handleTouchMove as any, { passive: false })
      canvas.addEventListener('touchend', handleTouchEnd as any)
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)
      canvas.addEventListener('wheel', handleWheel, { passive: false })

      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart as any)
        canvas.removeEventListener('touchmove', handleTouchMove as any)
        canvas.removeEventListener('touchend', handleTouchEnd as any)
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseup', handleMouseUp)
        canvas.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isDragging, isPinching, scale, lastTouchDistance, lastTouchCenter])

  return (
    <group
      ref={groupRef}
      rotation={[rotation.x, rotation.y, 0]}
      scale={scale}
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
  const [isARActive, setIsARActive] = useState(false)
  const [modelScale, setModelScale] = useState(1)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar')
        .then(supported => setIsARSupported(supported))
        .catch(() => setIsARSupported(false))
    } else {
      setIsARSupported(false)
    }
  }, [])

  const startAR = async () => {
    if (isARSupported) {
      try {
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay']
        })
        setIsARActive(true)
        session.addEventListener('end', () => setIsARActive(false))
      } catch (err) {
        console.error('Failed to start AR session:', err)
        setIsARSupported(false)
      }
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">
      <Canvas
        camera={{ fov: 50, position: [0, 0, 3] }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
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

        {isARSupported && !isARActive && (
          <button
            onClick={startAR}
            className="bg-gold hover:bg-gold-light text-wood-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            📱 启动 AR
          </button>
        )}
      </div>

      {isARSupported && (
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm flex justify-center gap-6">
            <span>🖱️ 拖动旋转</span>
            <span>🔍 滚轮缩放</span>
            <span>📱 AR 模式</span>
          </div>
        </div>
      )}

      {!isARSupported && isARSupported !== null && (
        <div className="absolute bottom-6 left-4 right-4 z-10">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm flex justify-center gap-4">
            <span>🖱️ 拖动旋转</span>
            <span>🔍 滚轮缩放</span>
            <span>🤏 双指缩放</span>
          </div>
          <div className="text-center mt-2 text-white/50 text-xs">
            AR 功能需要在支持的浏览器中打开（Chrome Android 或 Safari iOS）
          </div>
        </div>
      )}

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
