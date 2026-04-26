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
  const containerRef = useRef<HTMLDivElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelScale, setModelScale] = useState(1)
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const [initialScale, setInitialScale] = useState(1)

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        const constraints = [
          { video: { facingMode: 'environment' } },
          { video: { facingMode: 'user' } },
          { video: true }
        ]

        let mediaStream = null
        for (const constraint of constraints) {
          try {
            mediaStream = await navigator.mediaDevices.getUserMedia(constraint)
            stream = mediaStream
            break
          } catch {
            continue
          }
        }

        if (!stream) {
          throw new Error('无法访问任何摄像头')
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraActive(true)
          setError(null)
        }
      } catch (err) {
        const isWechat = /MicroMessenger/i.test(navigator.userAgent)
        if (isWechat) {
          setError('请在微信中点击右上角「...」，选择「在浏览器中打开」以获得更好的 AR 体验')
        } else {
          setError('无法访问摄像头，请确保已授予摄像头权限')
        }
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      setDragStart({ x: touch.clientX - modelPosition.x, y: touch.clientY - modelPosition.y })
      setIsDragging(true)
    } else if (e.touches.length === 2) {
      setIsDragging(false)
      setInitialPinchDistance(getTouchDistance(e.touches))
      setInitialScale(modelScale)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0]
      setModelPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      })
    } else if (e.touches.length === 2 && initialPinchDistance !== null) {
      const currentDistance = getTouchDistance(e.touches)
      const scaleFactor = currentDistance / initialPinchDistance
      const newScale = Math.min(Math.max(initialScale * scaleFactor, 0.3), 5)
      setModelScale(newScale)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false)
    setInitialPinchDistance(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart({ x: e.clientX - modelPosition.x, y: e.clientY - modelPosition.y })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setModelPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setModelScale(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.3), 5))
  }

  const resetView = () => {
    setModelScale(1)
    setModelPosition({ x: 0, y: 0 })
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden select-none">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white max-w-sm">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-wood-900 px-6 py-2 rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              重试
            </button>
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
            className="absolute inset-0 pointer-events-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          />

          <div
            className="absolute pointer-events-none"
            style={{
              left: `calc(50% + ${modelPosition.x}px)`,
              top: `calc(50% + ${modelPosition.y}px)`,
              transform: `translate(-50%, -50%) scale(${modelScale})`,
            }}
          >
            <ARModelViewer modelUrl={modelUrl} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {modelName}
            </div>
          </div>

          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-white text-sm font-bold">{modelName}</div>
              <div className="text-white/60 text-xs">AR 增强现实</div>
            </div>
            <button
              onClick={resetView}
              className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm hover:bg-black/90 transition-colors"
            >
              🔄 重置
            </button>
          </div>

          <div className="absolute bottom-6 left-4 right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm flex justify-center gap-6">
              <span>👆 单指拖动</span>
              <span>🤏 双指缩放</span>
              <span>🔄 重置视角</span>
            </div>
          </div>

          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <div className="bg-black/50 rounded-full px-3 py-1">
              <span className="text-white text-xs">缩放: {Math.round(modelScale * 100)}%</span>
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
