'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ARModelViewer from '@/components/ARModelViewer'

const buildingsAR = [
  { id: 1, name: '太和殿', modelUrl: '/models/taihe-palace.glb' },
  { id: 2, name: '悬空寺', modelUrl: '/models/shanxixuankongsi.glb' },
  { id: 3, name: '彩塑供养菩萨', modelUrl: '/models/saisupusa.glb' },
  { id: 4, name: '北京长城', modelUrl: '/models/beijingchangchen.glb' },
  { id: 5, name: '黄鹤楼', modelUrl: '/models/huanghelou.glb' },
  { id: 6, name: '滕王阁', modelUrl: '/models/tengwangge.glb' },
  { id: 7, name: '四合院', modelUrl: '/models/siheyuan.glb' },
  { id: 8, name: '大雁塔', modelUrl: '/models/dayanta.glb' },
  { id: 9, name: '廓如亭', modelUrl: '/models/guoruting.glb' }
]

function CameraARView({ modelUrl, modelName }: { modelUrl: string; modelName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelScale, setModelScale] = useState(1)
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraActive(true)
        }
      } catch (err) {
        setError('无法访问摄像头，请确保已授予摄像头权限')
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setDragStart({ x: touch.clientX - modelPosition.x, y: touch.clientY - modelPosition.y })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    setModelPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setModelScale(prev => Math.min(Math.max(prev - e.deltaY * 0.002, 0.2), 3))
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden touch-none select-none">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-white/60 text-sm">
              请在浏览器设置中允许使用摄像头
            </p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          <div
            className="absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          />

          <div
            className="absolute pointer-events-auto cursor-grab active:cursor-grabbing transition-transform duration-75"
            style={{
              left: `calc(50% + ${modelPosition.x}px)`,
              top: `calc(50% + ${modelPosition.y}px)`,
              transform: `translate(-50%, -50%) scale(${modelScale})`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ARModelViewer modelUrl={modelUrl} />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {modelName}
            </div>
          </div>

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-white text-sm font-bold">{modelName}</div>
              <div className="text-white/60 text-xs">AR 增强现实</div>
            </div>
          </div>

          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm flex justify-center gap-6">
              <span>👆 拖动移动</span>
              <span>🤏 双指缩放</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ARViewContent() {
  const searchParams = useSearchParams()
  const modelId = searchParams.get('model')
  const building = buildingsAR.find(b => b.id === Number(modelId))

  if (!building) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-900 to-wood-800 flex items-center justify-center p-8">
        <div className="card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-serif font-bold text-gold mb-2">模型未找到</h2>
          <p className="text-cream/60 mb-4">该建筑模型不存在或已被移除</p>
          <a href="/ar" className="text-gold hover:underline">
            返回 AR 展厅
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-screen bg-black">
      <div className="h-full">
        <CameraARView modelUrl={building.modelUrl} modelName={building.name} />
      </div>
    </div>
  )
}

export default function ARViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
      </div>
    }>
      <ARViewContent />
    </Suspense>
  )
}
