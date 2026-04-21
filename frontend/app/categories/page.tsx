'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const architectureCategories = [
  {
    id: 1,
    name: '宫殿建筑',
    icon: '🏛️',
    description: '古代帝王居住理政的建筑群，以宏伟壮丽著称',
    examples: ['故宫', '天坛', '颐和园'],
    color: 'from-yellow-600/20 to-amber-600/20'
  },
  {
    id: 2,
    name: '宗教建筑',
    icon: '⛩️',
    description: '佛教、道教等宗教场所的建筑艺术',
    examples: ['寺庙', '道观', '石窟'],
    color: 'from-red-600/20 to-orange-600/20'
  },
  {
    id: 3,
    name: '园林建筑',
    icon: '🏡',
    description: '私家园林与皇家园林的典范之作',
    examples: ['苏州园林', '承德避暑山庄', '拙政园'],
    color: 'from-green-600/20 to-emerald-600/20'
  },
  {
    id: 4,
    name: '民居建筑',
    icon: '🏠',
    description: '各地特色传统民居建筑',
    examples: ['四合院', '徽派建筑', '吊脚楼'],
    color: 'from-blue-600/20 to-cyan-600/20'
  },
  {
    id: 5,
    name: '长城关隘',
    icon: '🏰',
    description: '军事防御建筑的杰出代表',
    examples: ['八达岭长城', '山海关', '嘉峪关'],
    color: 'from-stone-600/20 to-zinc-600/20'
  },
  {
    id: 6,
    name: '桥梁建筑',
    icon: '🌉',
    description: '古代桥梁工程的智慧结晶',
    examples: ['赵州桥', '卢沟桥', '永宁桥'],
    color: 'from-slate-600/20 to-gray-600/20'
  }
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setArticles(data)
    setLoading(false)
  }

  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category_id === selectedCategory)
    : articles

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

        {/* 分类卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {architectureCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
              className={`card p-6 text-left transition-all duration-300 hover:scale-102 border-2 ${
                selectedCategory === category.id
                  ? 'border-gold shadow-lg shadow-gold/20'
                  : 'border-transparent hover:border-wood-600/50'
              }`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} mb-4`}>
                <span className="text-4xl">{category.icon}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-gold mb-2">
                {category.name}
              </h3>
              <p className="text-cream/70 text-sm mb-4">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.examples.map((example, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-wood-700/50 text-cream/60 px-2 py-1 rounded"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* 筛选指示器 */}
        {selectedCategory && (
          <div className="flex items-center justify-between mb-6 p-4 card">
            <div className="flex items-center gap-3">
              <span className="text-gold">
                {architectureCategories.find(c => c.id === selectedCategory)?.icon}
              </span>
              <span className="text-cream/80">
                当前筛选: <span className="text-gold font-medium">
                  {architectureCategories.find(c => c.id === selectedCategory)?.name}
                </span>
              </span>
              <span className="text-cream/50">({filteredArticles.length} 篇文章)</span>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* 文章列表 */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-gold mb-6">
            {selectedCategory ? '分类文章' : '全部文章'}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-40 bg-wood-700/50 rounded-lg mb-4"></div>
                  <div className="h-6 bg-wood-700/50 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-wood-700/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-wood-700/50 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/knowledge?article=${article.id}`}
                  className="card overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  <div className="h-40 bg-gradient-to-br from-gold/20 to-wood-700/50 flex items-center justify-center">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl opacity-50">📜</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-serif font-bold text-gold mb-2 group-hover:text-gold-light transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-cream/70 text-sm line-clamp-2 mb-4">
                      {article.summary || article.content?.slice(0, 100) + '...'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-cream/50">
                      <span>{new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
                      <span className="text-gold group-hover:translate-x-1 transition-transform">
                        阅读 →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-6xl mb-4">📚</p>
              <p className="text-cream/60 mb-4">
                {selectedCategory 
                  ? '该分类下暂无文章'
                  : '暂无文章'
                }
              </p>
              <Link href="/knowledge" className="text-gold hover:text-gold-light transition-colors">
                去知识库添加 →
              </Link>
            </div>
          )}
        </div>

        {/* 返回首页 */}
        <div className="text-center">
          <Link href="/home" className="text-cream/60 hover:text-gold transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
