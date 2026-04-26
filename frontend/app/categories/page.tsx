'use client'

import Link from 'next/link'
import { useState } from 'react'

// 建筑分类数据
const architectureCategories = [
  {
    id: 1,
    name: '宫殿建筑',
    slug: 'palace',
    image: '/images/categories/palace.jpg',
    icon: '🏛️',
    description: '古代帝王居住理政的建筑群，以宏伟壮丽著称',
    examples: ['故宫', '天坛', '颐和园']
  },
  {
    id: 2,
    name: '宗教建筑',
    slug: 'religion',
    image: '/images/categories/religious.jpg',
    icon: '🛕',
    description: '佛教、道教等宗教场所的建筑艺术',
    examples: ['寺庙', '道观', '石窟']
  },
  {
    id: 3,
    name: '园林建筑',
    slug: 'garden',
    image: '/images/categories/garden.jpg',
    icon: '🏡',
    description: '私家园林与皇家园林的典范之作',
    examples: ['苏州园林', '承德避暑山庄', '拙政园']
  },
  {
    id: 4,
    name: '民居建筑',
    slug: 'residential',
    image: '/images/categories/residential.jpg',
    icon: '🏠',
    description: '各地特色传统民居建筑',
    examples: ['四合院', '徽派建筑', '吊脚楼']
  },
  {
    id: 5,
    name: '长城关隘',
    slug: 'greatwall',
    image: '/images/categories/greatwall.jpg',
    icon: '🏯',
    description: '军事防御建筑的杰出代表',
    examples: ['八达岭长城', '山海关', '嘉峪关']
  },
  {
    id: 6,
    name: '桥梁建筑',
    slug: 'bridge',
    image: '/images/categories/bridge.jpg',
    icon: '🌉',
    description: '古代桥梁工程的智慧结晶',
    examples: ['赵州桥', '卢沟桥', '永宁桥']
  }
]

export default function CategoriesPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
            建筑分类
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto">
            按照建筑类型浏览中国传统建筑，深入了解每种建筑的独特魅力
          </p>
        </div>

        {/* 分类卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {architectureCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="card overflow-hidden group cursor-pointer block"
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* 图片区域 */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredId === category.id ? 'scale-110' : ''
                  }`}
                />
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E16] via-[#2A1E16]/40 to-transparent"></div>
                {/* 分类图标 */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-[#2A1E16]/70 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-gold/20">
                  {category.icon}
                </div>
                {/* 悬停时的边框光效 */}
                <div className={`absolute inset-0 border-2 border-gold/30 rounded-none transition-opacity duration-300 ${
                  hoveredId === category.id ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-gold mb-2 group-hover:text-gold-light transition-colors">
                  {category.name}
                </h3>
                <p className="text-cream/70 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-wood-700/50 text-cream/80 px-3 py-1.5 rounded-full border border-wood-600/30 hover:border-gold/30 hover:text-gold transition-colors"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <Link href="/home" className="text-cream/50 hover:text-gold transition-colors text-sm inline-flex items-center gap-2">
            <span>←</span>
            <span>返回首页</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
