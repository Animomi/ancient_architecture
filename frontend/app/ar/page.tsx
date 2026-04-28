'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

const buildingsAR = [
  {
    id: 1,
    name: '太和殿',
    category: '宫殿建筑',
    icon: '🏛️',
    description: '紫禁城核心建筑，皇帝举行重大典礼的场所',
    modelUrl: '/models/taihe-palace.glb'
  },
  {
    id: 2,
    name: '悬空寺',
    category: '宗教建筑',
    icon: '🏔️',
    description: '建在悬崖之上，半悬半空建筑奇观',
    modelUrl: '/models/shanxixuankongsi.glb'
  },
  {
    id: 3,
    name: '彩塑供养菩萨',
    category: '雕塑艺术',
    icon: '🎨',
    description: '佛教艺术珍品，精美彩塑造像',
    modelUrl: '/models/saisupusa.glb'
  },
  {
    id: 4,
    name: '北京长城',
    category: '防御建筑',
    icon: '🏯',
    description: '世界文化遗产，中华民族的精神象征',
    modelUrl: '/models/beijingchangchen.glb'
  },
  {
    id: 5,
    name: '黄鹤楼',
    category: '楼阁建筑',
    icon: '🗼',
    description: '江南三大名楼之一，崔颢诗中所咏之地',
    modelUrl: '/models/huanghelou.glb'
  },
  {
    id: 6,
    name: '滕王阁',
    category: '楼阁建筑',
    icon: '🏯',
    description: '江南三大名楼之一，滕王阁序诞生地',
    modelUrl: '/models/tengwangge.glb'
  },
  {
    id: 7,
    name: '四合院',
    category: '民居建筑',
    icon: '🏠',
    description: '北京传统民居的代表，四面围合院落',
    modelUrl: '/models/siheyuan.glb'
  },
  {
    id: 8,
    name: '大雁塔',
    category: '塔式建筑',
    icon: '🗼',
    description: '唐代长安城的地标，玄奘译经藏经之处',
    modelUrl: '/models/dayanta.glb'
  },
  {
    id: 9,
    name: '廓如亭',
    category: '园林建筑',
    icon: '🏡',
    description: '中国最大的一座亭廊式建筑',
    modelUrl: '/models/guoruting.glb'
  }
]

function QRCodeCard({ building }: { building: typeof buildingsAR[0] }) {
  const [showQR, setShowQR] = useState(false)
  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/ar/view?model=${building.id}` 
    : ''

  return (
    <div
      className="card p-6 hover:scale-105 transition-transform duration-300 group"
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
        {building.icon}
      </div>
      <span className={`text-xs px-2 py-1 rounded ${
        building.modelUrl 
          ? 'bg-gold/20 text-gold' 
          : 'bg-cream/10 text-cream/50'
      }`}>
        {building.modelUrl ? building.category : 'AR 准备中'}
      </span>
      <h3 className="text-lg font-serif font-bold text-gold mt-3 mb-2">
        {building.name}
        {building.modelUrl && <span className="ml-2 text-xs">✓</span>}
      </h3>
      <p className="text-cream/70 text-sm mb-4">
        {building.description}
      </p>

      {building.modelUrl && (
        <>
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full mt-2 px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {showQR ? '隐藏二维码' : '📱 扫码 AR 体验'}
          </button>

          {showQR && (
            <div className="mt-4 p-4 bg-white rounded-lg flex flex-col items-center">
              <p className="text-xs text-gray-600 mb-3 text-center">
                扫描二维码在手机上体验 AR
              </p>
              <QRCodeSVG 
                value={qrUrl}
                size={160}
                level="H"
                includeMargin={true}
              />
              <p className="text-xs text-gray-500 mt-3 text-center">
                {building.name}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="relative w-full h-full bg-black">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-cream/60 text-sm">
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
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-gold/50 rounded-lg">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg"></div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              将建筑模型对准取景框即可查看 AR 效果
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function ARViewer() {
  return (
    <div className="relative h-[600px] bg-gradient-to-b from-sky-900/30 to-wood-900 rounded-lg overflow-hidden">
      <CameraView />
      
      <div className="absolute top-4 left-4 bg-wood-900/80 backdrop-blur-sm rounded-lg p-4 text-white">
        <div className="text-sm font-bold mb-1">📱 AR 摄像头模式</div>
        <div className="text-xs text-cream/70">
          实时摄像头预览
        </div>
      </div>
    </div>
  )
}

export default function ARPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<typeof buildingsAR[0] | null>(null)
  const [showARViewer, setShowARViewer] = useState(false)

  if (showARViewer && selectedBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowARViewer(false)}
              className="text-cream/60 hover:text-gold transition-colors flex items-center gap-2"
            >
              ← 返回列表
            </button>
            <h2 className="text-xl font-serif font-bold text-gold">
              {selectedBuilding.icon} {selectedBuilding.name}
            </h2>
            <div className="w-24"></div>
          </div>

          <div className="card overflow-hidden">
            <ARViewer />
            
            <div className="p-6 bg-wood-800/50">
              <h3 className="text-lg font-serif font-bold text-gold mb-2">
                {selectedBuilding.name}
              </h3>
              <p className="text-cream/70">
                {selectedBuilding.description}
              </p>
              <div className="mt-4 p-4 bg-gold/10 rounded-lg">
                <p className="text-sm text-gold/80">
                  💡 提示：将手机摄像头对准古建筑图片或实物，即可在屏幕上叠加虚拟模型
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
            AR 古建筑体验
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto">
            扫描二维码将建筑模型投影到真实环境中，身临其境地欣赏建筑魅力
          </p>
        </div>

        <div className="card p-6 mb-8 bg-amber-900/20 border-amber-500/30">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📱</span>
            <div>
              <h3 className="text-lg font-bold text-amber-400 mb-2">AR 体验方式</h3>
              <ul className="text-cream/70 text-sm space-y-2">
                <li>• <strong className="text-amber-300">扫码体验：</strong>点击建筑卡片下方的&quot;扫码 AR 体验&quot;，显示二维码</li>
                <li>• <strong className="text-amber-300">手机扫码：</strong>使用手机微信/支付宝扫描二维码</li>
                <li>• <strong className="text-amber-300">AR 查看：</strong>手机将调用摄像头，对准建筑图片即可看到 AR 效果</li>
                <li>• 建议在光线充足、环境简单的场所使用</li>
                <li>• 首次使用需授予摄像头权限</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-12 text-center bg-gradient-to-r from-gold/10 to-amber-900/20">
          <div className="text-6xl mb-4">📲</div>
          <h3 className="text-xl font-serif font-bold text-gold mb-2">
            选择建筑，获取 AR 二维码
          </h3>
          <p className="text-cream/60 max-w-lg mx-auto">
            点击下方建筑卡片，展开后扫描二维码在手机上体验 AR
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {buildingsAR.map((building) => (
            <QRCodeCard key={building.id} building={building} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📲</div>
            <h4 className="font-serif font-bold text-gold mb-2">扫码即用</h4>
            <p className="text-cream/60 text-sm">无需下载 APP，微信扫码即可体验</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📸</div>
            <h4 className="font-serif font-bold text-gold mb-2">实时预览</h4>
            <p className="text-cream/60 text-sm">手机摄像头实时取景，AR 叠加显示</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📐</div>
            <h4 className="font-serif font-bold text-gold mb-2">真实比例</h4>
            <p className="text-cream/60 text-sm">1:1 比例展示，感受建筑的真实大小</p>
          </div>
        </div>

        <div className="text-center space-x-6">
          <Link href="/3d" className="inline-flex items-center gap-2 px-6 py-3 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition-colors">
            🎮 3D 展厅
          </Link>
          <Link href="/home" className="text-cream/60 hover:text-gold transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
