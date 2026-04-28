'use client'

import Link from 'next/link'
import { useState } from 'react'

export interface ArchitectureDetailProps {
  name: string
  subtitle: string
  category: string
  tags: string[]
  coverImage: string
  galleryImages?: string[]
  overview: string
  history: {
    title: string
    content: string
  }[]
  features?: {
    title: string
    content: string
  }[]
  culture?: string
  location: {
    address: string
    coordinates?: string
    openingHours: string
    ticketInfo?: string
  }
  slug: string
}

export default function ArchitectureDetailPage({ architecture }: { architecture: ArchitectureDetailProps }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'features' | 'location'>('overview')
  const [selectedImage, setSelectedImage] = useState(0)

  const tabs = [
    { id: 'overview', label: '建筑概述' },
    { id: 'history', label: '历史沿革' },
    { id: 'features', label: '建筑特色' },
    { id: 'location', label: '位置信息' },
  ] as const

  const allImages = [architecture.coverImage, ...(architecture.galleryImages || [])]

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(80, 65, 50, 0.70), rgba(90, 70, 55, 0.78)), 
                        url('/images/forbidden-city-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 返回导航 */}
        <div className="mb-6">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-amber-200/80 hover:text-amber-400 transition-all duration-300 group"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span className="text-sm">返回建筑分类</span>
          </Link>
        </div>

        {/* 主内容区域 - 左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.1fr] gap-8 mb-10">
          {/* 左侧 - 图片展示 */}
          <div className="space-y-4">
            {/* 主图 */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 group border border-amber-600/20">
              <div className="aspect-[4/3]">
                <img
                  src={allImages[selectedImage]}
                  alt={architecture.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              {/* 分类标签 */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#3D2E20]/80 backdrop-blur-md text-amber-300 text-xs font-medium px-4 py-1.5 rounded-full border border-amber-500/30">
                  {architecture.category}
                </span>
              </div>
              {/* 图片计数 */}
              <div className="absolute bottom-4 right-4 bg-[#3D2E20]/80 backdrop-blur-md text-amber-200/90 text-xs px-3 py-1 rounded-full">
                {selectedImage + 1} / {allImages.length}
              </div>
            </div>

            {/* 缩略图网格 */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 border ${
                      selectedImage === idx
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#3D2E20] shadow-lg border-amber-400'
                        : 'opacity-70 hover:opacity-100 hover:scale-105 border-amber-600/30 hover:border-amber-500/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${architecture.name} - 图 ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧 - 信息区域 */}
          <div className="space-y-5">
            {/* 标题区域 */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                {architecture.name}
              </h1>
              <p className="text-amber-100/85 text-lg tracking-wide">
                {architecture.subtitle}
              </p>
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 pt-2">
                {architecture.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#4A3828]/80 text-amber-200/95 px-4 py-1.5 rounded-full border border-amber-500/30 hover:border-amber-400/50 hover:bg-[#4A3828] transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 分割线 */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent" />

            {/* 标签导航 */}
            <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-xl p-1.5 border border-amber-500/30">
              <div className="grid grid-cols-4 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-[#1a1410] shadow-lg shadow-amber-500/30'
                        : 'text-amber-200/80 hover:text-amber-100 hover:bg-[#5A4838]/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-2xl p-6 min-h-[420px] border border-amber-500/30 shadow-xl">
              {/* 建筑概述 */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                    <h2 className="text-xl font-serif font-bold text-amber-100">建筑概述</h2>
                  </div>
                  <p className="text-cream leading-relaxed text-[15px]">
                    {architecture.overview}
                  </p>
                  {architecture.culture && (
                    <div className="mt-6 p-5 bg-[#5A4838]/60 rounded-xl border border-amber-500/30">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-amber-400">✦</span>
                        <h3 className="text-lg font-serif font-bold text-amber-100">文化意义</h3>
                      </div>
                      <p className="text-cream/90 leading-relaxed text-[14px]">{architecture.culture}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 历史沿革 */}
              {activeTab === 'history' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                    <h2 className="text-xl font-serif font-bold text-amber-100">历史沿革</h2>
                  </div>
                  <div className="space-y-4">
                    {architecture.history.map((section, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-amber-600/40">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 bg-amber-400 rounded-full" />
                        <h3 className="text-base font-medium text-amber-100/95 mb-2">{section.title}</h3>
                        <p className="text-cream/80 leading-relaxed text-[14px]">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 建筑特色 */}
              {activeTab === 'features' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                    <h2 className="text-xl font-serif font-bold text-amber-100">建筑特色</h2>
                  </div>
                  {architecture.features && architecture.features.length > 0 ? (
                    <div className="space-y-3">
                      {architecture.features.map((feature, idx) => (
                        <div key={idx} className="p-4 bg-[#5A4838]/60 rounded-xl border border-amber-500/30 hover:border-amber-400/50 transition-colors">
                          <h3 className="text-base font-medium text-amber-100/95 mb-2 flex items-center gap-2">
                            <span className="text-amber-400">◆</span>
                            {feature.title}
                          </h3>
                          <p className="text-cream/80 leading-relaxed text-[14px]">{feature.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-cream/50 italic text-center py-8">暂无详细特色介绍</p>
                  )}
                </div>
              )}

              {/* 位置信息 */}
              {activeTab === 'location' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                    <h2 className="text-xl font-serif font-bold text-amber-100">位置信息</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {/* 地址 */}
                    <div className="flex items-start gap-4 p-4 bg-[#5A4838]/60 rounded-xl border border-amber-500/30">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 text-lg">📍</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-amber-400/80 mb-1 uppercase tracking-wider">地址</h3>
                        <p className="text-cream/95 text-[14px]">{architecture.location.address}</p>
                      </div>
                    </div>

                    {/* 坐标 */}
                    {architecture.location.coordinates && (
                      <div className="flex items-start gap-4 p-4 bg-[#5A4838]/60 rounded-xl border border-amber-500/30">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-400 text-lg">🧭</span>
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-amber-400/80 mb-1 uppercase tracking-wider">坐标</h3>
                          <p className="text-cream/90 text-[14px]">{architecture.location.coordinates}</p>
                        </div>
                      </div>
                    )}

                    {/* 开放时间 */}
                    <div className="flex items-start gap-4 p-4 bg-[#5A4838]/60 rounded-xl border border-amber-500/30">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 text-lg">🕐</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-amber-400/80 mb-1 uppercase tracking-wider">开放时间</h3>
                        <p className="text-cream/90 text-[14px]">{architecture.location.openingHours}</p>
                      </div>
                    </div>

                    {/* 门票信息 */}
                    {architecture.location.ticketInfo && (
                      <div className="flex items-start gap-4 p-4 bg-[#5A4838]/60 rounded-xl border border-amber-500/30">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-amber-400 text-lg">🎫</span>
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-amber-400/80 mb-1 uppercase tracking-wider">门票信息</h3>
                          <p className="text-cream/90 text-[14px]">{architecture.location.ticketInfo}</p>
                        </div>
                      </div>
                    )}

                    {/* 百度地图预留区域 */}
                    <div className="rounded-xl overflow-hidden border border-amber-500/30">
                      <div className="bg-[#4A3828]/[0.85] backdrop-blur-md p-4 text-center border-b border-amber-500/30">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-amber-400 text-lg">🗺️</span>
                          <h3 className="text-sm font-medium text-amber-100">地图位置</h3>
                        </div>
                      </div>
                      {/* 地图占位图区域 */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {/* 背景图片 */}
                        <img
                          src="/images/detail/forbidden-city-map-placeholder.png"
                          alt="地图占位图"
                          className="absolute inset-0 w-full h-full object-contain bg-[#3D2E20]/60"
                        />
                        {/* 渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4A3828]/30 via-transparent to-[#3D2E20]/30 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="text-center pt-8 border-t border-amber-600/30">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/home" className="px-6 py-2.5 rounded-lg text-sm font-medium border-2 border-amber-400 text-amber-200 hover:bg-amber-400 hover:text-[#1a1410] transition-all duration-300">
              返回首页
            </Link>
            <Link href="/categories" className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
              浏览更多分类
            </Link>
          </div>
          <Link href="/gallery" className="text-cream/70 hover:text-amber-300 transition-colors text-sm inline-flex items-center gap-2">
            <span>探索图集欣赏</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </div>
  )
}
