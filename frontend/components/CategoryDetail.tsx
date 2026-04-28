'use client'

import Link from 'next/link'
import { useState } from 'react'

interface ArchitectureExample {
  name: string
  description: string
  image: string
  slug: string
}

interface ArchitectureCategory {
  title: string
  subtitle: string
  description: string
  icon: string
  coverImage: string
  examples: ArchitectureExample[]
}

interface CategoryDetailProps {
  category: ArchitectureCategory
}

export default function CategoryDetail({ category }: CategoryDetailProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
      {/* 顶部装饰区域 */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={category.coverImage}
          alt={category.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1E16]/40 via-[#2A1E16]/60 to-[#2A1E16]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">{category.icon}</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-2">
              {category.title}
            </h1>
            <p className="text-cream/80 text-lg max-w-xl mx-auto px-4">
              {category.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 返回导航 */}
        <div className="mb-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span>返回建筑分类</span>
          </Link>
        </div>

        {/* 分类介绍 */}
        <div className="card p-6 md:p-8 mb-12">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gold mb-3">
                {category.title}概述
              </h2>
              <p className="text-cream/80 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* 代表性建筑 */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gold mb-2 text-center">
            代表性建筑
          </h2>
          <p className="text-cream/60 text-center mb-8">
            探索中国 {category.title} 的经典之作
          </p>
        </div>

        {/* 建筑卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {category.examples.map((example, index) => (
            <Link
              key={index}
              href={`/detail/${example.slug}`}
              className="card overflow-hidden group cursor-pointer block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 图片区域 - 优化为全图覆盖 */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={example.image}
                  alt={example.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredIndex === index ? 'scale-110' : ''
                  }`}
                />
                {/* 深色渐变遮罩 - 底部文字区域 */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E16]/95 via-[#2A1E16]/50 to-transparent"></div>
                {/* 悬停边框效果 */}
                <div className={`absolute inset-0 border-2 border-gold/40 transition-opacity duration-300 rounded-lg ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}></div>
                {/* 悬停时的查看详情按钮 */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className="bg-gold/95 text-wood-900 text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg hover:bg-gold hover:scale-105 transition-all">
                    查看详情
                  </span>
                </div>
              </div>

              {/* 内容区域 - 覆盖在图片底部 */}
              <div className="relative -mt-20 p-5">
                <h3 className="text-xl font-serif font-bold text-cream mb-2 group-hover:text-gold transition-colors drop-shadow-lg">
                  {example.name}
                </h3>
                <p className="text-cream/75 text-sm leading-relaxed drop-shadow-md">
                  {example.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部导航 */}
        <div className="text-center pt-8 border-t border-wood-700/30">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link href="/home" className="btn-secondary text-sm py-2 px-5">
              返回首页
            </Link>
            <Link href="/categories" className="btn-primary text-sm py-2 px-5">
              浏览更多分类
            </Link>
          </div>
          <Link href="/gallery" className="text-cream/50 hover:text-gold transition-colors text-sm inline-flex items-center gap-2">
            <span>探索图集欣赏</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
