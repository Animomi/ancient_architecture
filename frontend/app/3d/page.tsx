'use client'

import { useState } from 'react'
import Link from 'next/link'

const buildings3D = [
  {
    id: 1,
    name: '故宫太和殿',
    category: '宫殿建筑',
    icon: '🏛️',
    description: '紫禁城核心建筑，皇帝举行重大典礼的场所'
  },
  {
    id: 2,
    name: '天坛祈年殿',
    category: '祭祀建筑',
    icon: '⛩️',
    description: '祈谷祭天专用，圆形尖顶三层蓝色琉璃瓦'
  },
  {
    id: 3,
    name: '应县木塔',
    category: '塔式建筑',
    icon: '🗼',
    description: '世界最高木塔，纯木结构不用一钉一铆'
  },
  {
    id: 4,
    name: '赵州桥',
    category: '桥梁建筑',
    icon: '🌉',
    description: '隋代石拱桥杰作，敞肩式设计世界首创'
  },
  {
    id: 5,
    name: '佛光寺东大殿',
    category: '宗教建筑',
    icon: '⛪',
    description: '唐代木结构建筑珍品，距今千余年'
  },
  {
    id: 6,
    name: '悬空寺',
    category: '宗教建筑',
    icon: '🏔️',
    description: '建在悬崖之上，半悬半空建筑奇观'
  }
]

export default function ThreeDPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<typeof buildings3D[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleView3D = (building: typeof buildings3D[0]) => {
    setIsLoading(true)
    setSelectedBuilding(building)
    // 模拟加载
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
            3D 古建筑展厅
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto">
            通过交互式 3D 模型，全方位欣赏中国传统建筑的精妙结构
          </p>
        </div>

        {/* 3D 展示区域 */}
        {selectedBuilding ? (
          <div className="mb-12">
            <div className="card overflow-hidden">
              {/* 3D 场景容器 */}
              <div className="relative h-[500px] bg-gradient-to-b from-sky-900/50 to-wood-900 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent mb-4"></div>
                    <p className="text-cream/60">正在加载 3D 模型...</p>
                  </div>
                ) : (
                  <>
                    {/* 模拟 3D 场景 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-9xl mb-4 animate-float">{selectedBuilding.icon}</div>
                        <h2 className="text-3xl font-serif font-bold text-gold mb-2">
                          {selectedBuilding.name}
                        </h2>
                        <p className="text-cream/60">{selectedBuilding.description}</p>
                      </div>
                    </div>

                    {/* 控制提示 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 text-sm text-cream/50">
                      <span>🖱️ 拖拽旋转</span>
                      <span>🔍 滚轮缩放</span>
                      <span>↔️ 平移视角</span>
                    </div>
                  </>
                )}
              </div>

              {/* 信息面板 */}
              <div className="p-6 bg-wood-800/50">
                <div className="flex items-center justify-between">
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
        ) : (
          <>
            {/* 提示信息 */}
            <div className="card p-8 mb-12 text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-serif font-bold text-gold mb-2">
                选择一个建筑开始探索
              </h3>
              <p className="text-cream/60 max-w-lg mx-auto">
                点击下方建筑卡片，进入 3D 展厅，全方位欣赏建筑细节
              </p>
            </div>

            {/* 建筑卡片网格 */}
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
                  <span className="text-xs bg-gold/10 text-gold/80 px-2 py-1 rounded">
                    {building.category}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-gold mt-3 mb-2">
                    {building.name}
                  </h3>
                  <p className="text-cream/70 text-sm">
                    {building.description}
                  </p>
                  <button className="mt-4 text-gold text-sm group-hover:text-gold-light transition-colors">
                    进入 3D 展厅 →
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 功能说明 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h4 className="font-serif font-bold text-gold mb-2">360° 旋转</h4>
            <p className="text-cream/60 text-sm">从任意角度观察建筑全貌</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h4 className="font-serif font-bold text-gold mb-2">细节放大</h4>
            <p className="text-cream/60 text-sm">放大查看建筑细部构造</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📖</div>
            <h4 className="font-serif font-bold text-gold mb-2">标注解读</h4>
            <p className="text-cream/60 text-sm">点击构件查看详细说明</p>
          </div>
        </div>

        {/* 返回链接 */}
        <div className="text-center">
          <Link href="/home" className="text-cream/60 hover:text-gold transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
