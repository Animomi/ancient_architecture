'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 古建筑数据
const architectureTypes = [
  {
    id: 1,
    name: '宫殿建筑',
    description: '古代帝王居住理政的建筑群，以宏伟壮丽著称',
    icon: '🏛️',
    examples: ['故宫', '天坛', '颐和园']
  },
  {
    id: 2,
    name: '宗教建筑',
    description: '佛教、道教等宗教场所的建筑艺术',
    icon: '⛩️',
    examples: ['寺庙', '道观', '石窟']
  },
  {
    id: 3,
    name: '园林建筑',
    description: '私家园林与皇家园林的典范之作',
    icon: '🏡',
    examples: ['苏州园林', '承德避暑山庄', '拙政园']
  },
  {
    id: 4,
    name: '民居建筑',
    description: '各地特色传统民居建筑',
    icon: '🏠',
    examples: ['四合院', '徽派建筑', '吊脚楼']
  },
  {
    id: 5,
    name: '长城关隘',
    description: '军事防御建筑的杰出代表',
    icon: '�城墙',
    examples: ['八达岭长城', '山海关', '嘉峪关']
  },
  {
    id: 6,
    name: '桥梁建筑',
    description: '古代桥梁工程的智慧结晶',
    icon: '🌉',
    examples: ['赵州桥', '卢沟桥', '永宁桥']
  }
]

// 精选内容
const featuredContent = [
  {
    id: 1,
    title: '故宫建筑群',
    category: '宫殿建筑',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    description: '世界现存最大、最完整的木质结构古建筑群'
  },
  {
    id: 2,
    title: '苏州园林',
    category: '园林建筑',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80',
    description: '中国古典园林艺术的代表之作'
  },
  {
    id: 3,
    title: '布达拉宫',
    category: '宗教建筑',
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    description: '藏式古建筑的巅峰之作'
  }
]

export default function HomePage() {
  const [userName, setUserName] = useState('')
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    // 获取用户信息
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const name = data.user.user_metadata?.username || data.user.email?.split('@')[0]
        setUserName(name)
      }
    })

    // 获取最新文章
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (data) setArticles(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-6xl animate-float">🏯</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gradient-gold mb-4">
            探索古建筑之美
          </h1>
          <p className="text-xl text-cream/80 mb-8 max-w-2xl mx-auto">
            {userName ? `欢迎回来，${userName}！` : '欢迎来到'} 中国传统建筑艺术展示平台，
            深入了解千年建筑智慧与美学
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/categories" className="btn-primary text-lg px-8 py-3">
              开始探索
            </Link>
            <Link href="/knowledge" className="btn-secondary text-lg px-8 py-3">
              学习知识
            </Link>
          </div>
        </div>

        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* 建筑分类 */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
              建筑分类
            </h2>
            <p className="text-cream/60 max-w-2xl mx-auto">
              探索不同类型的中国传统建筑，了解其独特的建筑风格与文化内涵
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {architectureTypes.map((type) => (
              <Link
                key={type.id}
                href={`/categories?type=${type.id}`}
                className="card p-6 hover:scale-105 transition-transform duration-300 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {type.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-gold mb-2">
                  {type.name}
                </h3>
                <p className="text-cream/70 text-sm mb-4">
                  {type.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gold/10 text-gold/80 px-2 py-1 rounded"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选内容 */}
      <section className="py-16 px-4 bg-wood-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
              精选内容
            </h2>
            <p className="text-cream/60">
              深入了解中国传统建筑的精华之作
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredContent.map((item) => (
              <article
                key={item.id}
                className="card overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-900/80 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-gold/20 text-gold text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gold mb-2 group-hover:text-gold-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-cream/70 text-sm mb-4">
                    {item.description}
                  </p>
                  <Link
                    href={`/knowledge?article=${item.id}`}
                    className="text-gold text-sm hover:text-gold-light transition-colors inline-flex items-center gap-1"
                  >
                    阅读全文
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI 助手介绍 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 text-center">
            <div className="text-5xl mb-6">🤖</div>
            <h2 className="text-3xl font-serif font-bold text-gold mb-4">
              AI 古建筑助手
            </h2>
            <p className="text-cream/70 mb-8 max-w-xl mx-auto">
              有任何关于古建筑的问题？让 AI 助手为你解答！
              从建筑结构到历史背景，都能为你提供详细的讲解。
            </p>
            <Link href="/ai" className="btn-primary text-lg px-8 py-3">
              咨询 AI 助手
            </Link>
          </div>
        </div>
      </section>

      {/* 3D 展示入口 */}
      <section className="py-16 px-4 bg-wood-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
                3D 古建筑展示
              </h2>
              <p className="text-cream/70 mb-6">
                通过交互式 3D 模型，全方位欣赏古建筑的精妙结构。
                旋转、缩放、深入了解每一个细节。
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-cream/80">
                  <span className="text-gold">✓</span>
                  高精度 3D 模型
                </li>
                <li className="flex items-center gap-3 text-cream/80">
                  <span className="text-gold">✓</span>
                  360° 全方位视角
                </li>
                <li className="flex items-center gap-3 text-cream/80">
                  <span className="text-gold">✓</span>
                  详细构件标注
                </li>
              </ul>
              <Link href="/3d" className="btn-primary">
                进入 3D 展厅
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center">
                <span className="text-9xl">🏯</span>
              </div>
              <div className="absolute -inset-4 border border-gold/20 rounded-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-wood-700/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream/50 text-sm">
            古建筑 - 中国传统建筑艺术展示平台 © 2026
          </p>
          <p className="text-cream/30 text-xs mt-2">
            基于现代 Web 技术，传承千年建筑智慧
          </p>
        </div>
      </footer>
    </div>
  )
}
