'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { QRCodeSVG } from 'qrcode.react'

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gradient-to-b from-sky-900/50 to-wood-900">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
    </div>
  )
})

const buildings3D = [
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

function ARModal({ modelUrl, modelName, modelId, onClose }: { 
  modelUrl: string
  modelName: string
  modelId: number
  onClose: () => void 
}) {
  const arUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/ar/view?model=${modelId}` 
    : ''

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/60 hover:text-cream text-2xl"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📱</div>
          <h3 className="text-xl font-serif font-bold text-gold">AR 增强现实体验</h3>
          <p className="text-cream/60 text-sm mt-2">
            扫描下方二维码，用手机摄像头体验 AR 效果
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg flex flex-col items-center">
          <QRCodeSVG 
            value={arUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
          <p className="text-gray-800 font-medium mt-4">{modelName}</p>
        </div>

        <div className="mt-6 p-4 bg-gold/10 rounded-lg">
          <h4 className="text-sm font-bold text-gold mb-2">使用说明</h4>
          <ul className="text-cream/70 text-xs space-y-1">
            <li>1. 使用微信或支付宝扫描二维码</li>
            <li>2. 进入 AR 页面后授予摄像头权限</li>
            <li>3. 将手机摄像头对准任意平面</li>
            <li>4. 点击屏幕放置 3D 模型</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function ThreeDPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<typeof buildings3D[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showARModal, setShowARModal] = useState(false)

  const handleView3D = (building: typeof buildings3D[0]) => {
    if (!building.modelUrl) {
      alert('该模型正在准备中...')
      return
    }
    setIsLoading(true)
    setSelectedBuilding(building)
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
            3D 古建筑展厅
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto">
            通过交互式 3D 模型，全方位欣赏中国传统建筑的精妙结构
          </p>
        </div>

        {selectedBuilding ? (
          <div className="mb-12">
            <div className="card overflow-hidden">
              <div className="relative h-[500px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center bg-gradient-to-b from-sky-900/50 to-wood-900">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mb-4"></div>
                      <p className="text-cream/60">正在加载 3D 模型...</p>
                    </div>
                  </div>
                ) : selectedBuilding.modelUrl ? (
                  <ModelViewer 
                    modelUrl={selectedBuilding.modelUrl}
                    autoRotate={true}
                    enableControls={true}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-b from-sky-900/50 to-wood-900">
                    <div className="text-center">
                      <div className="text-9xl mb-4">{selectedBuilding.icon}</div>
                      <h2 className="text-3xl font-serif font-bold text-gold mb-2">
                        {selectedBuilding.name}
                      </h2>
                      <p className="text-cream/60">{selectedBuilding.description}</p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 text-sm text-cream/50 bg-wood-900/80 px-6 py-3 rounded-full backdrop-blur-sm">
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-cream/20 rounded text-xs">滚轮</kbd>
                    <span>缩放</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-cream/20 rounded text-xs">左键</kbd>
                    <span>旋转</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-cream/20 rounded text-xs">右键</kbd>
                    <span>平移</span>
                  </span>
                </div>
              </div>

              <div className="p-6 bg-wood-800/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-sm bg-gold/20 text-gold px-3 py-1 rounded-full">
                      {selectedBuilding.category}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-gold mt-3">
                      {selectedBuilding.name}
                    </h3>
                    <p className="text-cream/70 mt-2 max-w-2xl">
                      {selectedBuilding.description}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {selectedBuilding.modelUrl && (
                      <button
                        onClick={() => setShowARModal(true)}
                        className="btn-primary flex items-center gap-2"
                      >
                        📱 AR 体验
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBuilding(null)}
                      className="btn-secondary"
                    >
                      返回列表
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="card p-8 mb-12 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-serif font-bold text-gold mb-2">
                选择一个建筑开始探索
              </h3>
              <p className="text-cream/60 max-w-lg mx-auto">
                点击下方建筑卡片，进入 3D 展厅，全方位欣赏建筑细节
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {buildings3D.map((building) => (
                <div
                  key={building.id}
                  className="card p-6 hover:scale-105 transition-transform duration-300 group cursor-pointer"
                  onClick={() => handleView3D(building)}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {building.icon}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    building.modelUrl 
                      ? 'bg-gold/20 text-gold' 
                      : 'bg-cream/10 text-cream/50'
                  }`}>
                    {building.modelUrl ? building.category : '模型准备中'}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-gold mt-3 mb-2">
                    {selectedBuilding?.id === building.id ? building.name : building.name}
                    {building.modelUrl && <span className="ml-2 text-xs">✓</span>}
                  </h3>
                  <p className="text-cream/70 text-sm">
                    {building.description}
                  </p>
                  <button className={`mt-4 text-sm transition-colors ${
                    building.modelUrl ? 'text-gold group-hover:text-gold-light' : 'text-cream/40'
                  }`}>
                    {building.modelUrl ? '进入 3D 展厅 →' : '敬请期待'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center">
          <Link href="/home" className="text-cream/60 hover:text-gold transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>

      {showARModal && selectedBuilding && (
        <ARModal
          modelUrl={selectedBuilding.modelUrl}
          modelName={selectedBuilding.name}
          modelId={selectedBuilding.id}
          onClose={() => setShowARModal(false)}
        />
      )}
    </div>
  )
}
