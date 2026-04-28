'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

const MiniModelViewer = dynamic(() => import('@/components/MiniModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="aspect-square rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-3 border-gold border-t-transparent"></div>
    </div>
  )
})

// 古建筑数据
const architectureTypes = [
  {
    id: 1,
    name: '宫殿建筑',
    slug: 'palace',
    description: '古代帝王居住理政的建筑群，以宏伟壮丽著称',
    image: '/images/categories/palace.jpg',
    examples: ['故宫', '天坛', '颐和园']
  },
  {
    id: 2,
    name: '宗教建筑',
    slug: 'religion',
    description: '佛教、道教等宗教场所的建筑艺术',
    image: '/images/categories/religious.jpg',
    examples: ['寺庙', '道观', '石窟']
  },
  {
    id: 3,
    name: '园林建筑',
    slug: 'garden',
    description: '私家园林与皇家园林的典范之作',
    image: '/images/categories/garden.jpg',
    examples: ['苏州园林', '承德避暑山庄', '拙政园']
  },
  {
    id: 4,
    name: '民居建筑',
    slug: 'residential',
    description: '各地特色传统民居建筑',
    image: '/images/categories/residential.jpg',
    examples: ['四合院', '徽派建筑', '吊脚楼']
  },
  {
    id: 5,
    name: '长城关隘',
    slug: 'greatwall',
    description: '军事防御建筑的杰出代表',
    image: '/images/categories/greatwall.jpg',
    examples: ['八达岭长城', '山海关', '嘉峪关']
  },
  {
    id: 6,
    name: '桥梁建筑',
    slug: 'bridge',
    description: '古代桥梁工程的智慧结晶',
    image: '/images/categories/bridge.jpg',
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

// 颜色图集数据
const colorPalettes = [
  { id: 'vermilion', name: '朱红', gradient: 'linear-gradient(135deg, #C73E3A 0%, #8B2500 100%)' },
  { id: 'gold', name: '明黄', gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
  { id: 'azure', name: '石青', gradient: 'linear-gradient(135deg, #3A7D8C 0%, #1E5F6E 100%)' },
  { id: 'jade', name: '黛绿', gradient: 'linear-gradient(135deg, #4A6741 0%, #2D4A2E 100%)' },
  { id: 'wood', name: '木棕', gradient: 'linear-gradient(135deg, #8B6914 0%, #5D4E37 100%)' },
  { id: 'grey', name: '青灰', gradient: 'linear-gradient(135deg, #708090 0%, #4A5568 100%)' },
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
    <div className="min-h-screen relative">
      {/* 全屏视频背景 */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/videos/background.mp4"
        />
        <div className="absolute inset-0 bg-[#2A1E16]/[0.65]"></div>
      </div>

      {/* 内容层 */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
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
        </section>

        {/* 建筑分类 */}
        <section className="py-16 px-4 bg-[#2A1E16]/[0.60]">
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
                  href={`/category/${type.slug}`}
                  className="card overflow-hidden hover:scale-105 transition-transform duration-300 group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={type.image}
                      alt={type.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E16] via-[#2A1E16]/40 to-transparent"></div>
                  </div>
                  <div className="p-6">
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 按颜色探索 */}
        <section className="py-20 px-4 bg-[#2A1E16]/[0.60]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-4">
                你最喜欢的颜色是什么？
              </h2>
              <p className="text-cream/60 max-w-2xl mx-auto">
                按颜色探索不同色调的古建筑图集
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {colorPalettes.map((color) => (
                <Link
                  key={color.id}
                  href={`/gallery?color=${color.id}`}
                  className="group relative w-28 h-36 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: color.gradient }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 border-2 border-white/20 rounded-xl group-hover:border-white/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <span className="text-white text-sm font-medium drop-shadow-lg">
                      {color.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 精选内容 */}
        <section className="py-16 px-4 bg-[#2A1E16]/[0.70]">
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
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card relative overflow-hidden p-8 md:p-12 text-center">
              {/* 装饰边框 */}
              <div className="absolute inset-0 border border-gold/20 rounded-2xl pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-gold/30 rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-gold/30 rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-gold/30 rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-gold/30 rounded-br-2xl"></div>

              {/* 图标区域 - 预留位置 */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <img
                  src="/images/ai-assistant-icon.png"
                  alt="AI助手"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* 标题 */}
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold mb-6 tracking-wide">
                AI 古建筑助手
              </h2>

              {/* 描述文字 */}
              <p className="text-cream/80 mb-10 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
                有任何关于古建筑的问题？让 AI 助手为你解答！
                <br className="hidden sm:block" />
                从建筑结构到历史背景，都能为你提供详细的讲解。
              </p>

              {/* 按钮 */}
              <Link
                href="/ai"
                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>咨询 AI 助手</span>
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3D 展示入口 */}
        <section className="py-16 px-4 bg-[#2A1E16]/[0.70]">
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square w-full max-w-[500px] mx-auto lg:mx-0 lg:max-w-none">
                <MiniModelViewer modelUrl="/models/siheyuan.glb" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-wood-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-cream/70">
                  旋转查看 · 四合院
                </div>
                <div className="absolute top-3 right-3 bg-gold/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-gold text-xs">3D</span>
                </div>
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
    </div>
  )
}
