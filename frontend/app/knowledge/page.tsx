'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getCurrentUser } from '@/lib/supabase'

export default function KnowledgePage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  
  // 新建文章表单
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    cover_image: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchArticles()
    checkUser()
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

  const checkUser = async () => {
    const { user } = await getCurrentUser()
    setUser(user)
  }

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    const { error } = await supabase.from('articles').insert({
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      cover_image: formData.cover_image || null,
      author_id: user.id
    })

    if (!error) {
      setFormData({ title: '', content: '', summary: '', cover_image: '' })
      setShowForm(false)
      fetchArticles()
    }
    setSubmitting(false)
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    await supabase.from('articles').delete().eq('id', id)
    setSelectedArticle(null)
    fetchArticles()
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(80, 65, 50, 0.65), rgba(90, 70, 55, 0.72)), 
                        url('/images/knowledge-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-2">
              知识库
            </h1>
            <p className="text-cream/80">
              探索中国传统建筑的历史与文化
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-900/20 flex items-center gap-2"
            >
              <span>+</span>
              {showForm ? '取消' : '写文章'}
            </button>
          )}
        </div>

        {/* 新建文章表单 */}
        {showForm && (
          <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-2xl p-6 mb-8 border border-amber-600/30 shadow-xl">
            <h3 className="text-xl font-serif font-bold text-amber-100 mb-6">撰写新文章</h3>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream/90 mb-2">
                  标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入文章标题"
                  required
                  className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-cream placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/90 mb-2">
                  摘要
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="请输入文章摘要（可选）"
                  className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-cream placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/90 mb-2">
                  封面图片 URL（可选）
                </label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-cream placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/90 mb-2">
                  内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入文章内容..."
                  required
                  rows={10}
                  className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-cream placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg disabled:opacity-50"
                >
                  {submitting ? '发布中...' : '发布文章'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 text-cream/90 rounded-xl hover:bg-[#5A4838] transition-all"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 文章列表 */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-xl p-6 border border-amber-600/30 animate-pulse">
                    <div className="h-6 bg-amber-800/30 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-amber-800/30 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-amber-800/30 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`bg-[#4A3828]/[0.85] backdrop-blur-md rounded-xl p-6 w-full text-left transition-all border ${
                      selectedArticle?.id === article.id 
                        ? 'border-amber-400 shadow-lg' 
                        : 'border-amber-600/30 hover:border-amber-400/50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {article.cover_image && (
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-cream/80 text-sm mb-2 line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-cream/60">
                          <span>{new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-xl p-12 text-center border border-amber-600/30">
                <p className="text-6xl mb-4">📝</p>
                <p className="text-cream/80 mb-4">还没有文章</p>
                {user && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    撰写第一篇文章 →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 文章详情 */}
          <div className="lg:col-span-1">
            {selectedArticle ? (
              <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-2xl p-6 sticky top-24 border border-amber-600/30 shadow-xl">
                {selectedArticle.cover_image && (
                  <img
                    src={selectedArticle.cover_image}
                    alt={selectedArticle.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-serif font-bold text-amber-100 mb-4">
                  {selectedArticle.title}
                </h2>
                <p className="text-cream/60 text-sm mb-6">
                  {new Date(selectedArticle.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="text-cream/95 text-sm whitespace-pre-wrap mb-6">
                  {selectedArticle.content}
                </div>
                {user?.id === selectedArticle.author_id && (
                  <button
                    onClick={() => handleDeleteArticle(selectedArticle.id)}
                    className="w-full py-2 bg-red-500/25 text-red-300 rounded-lg hover:bg-red-500/35 transition-colors border border-red-500/40"
                  >
                    删除文章
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-xl p-8 text-center sticky top-24 border border-amber-600/30">
                <p className="text-4xl mb-4">📖</p>
                <p className="text-cream/80">选择一个文章查看详情</p>
              </div>
            )}
          </div>
        </div>

        {/* 返回链接 */}
        <div className="mt-12 text-center">
          <Link href="/home" className="text-amber-200/80 hover:text-amber-400 transition-colors inline-flex items-center gap-2">
            <span>←</span> 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
