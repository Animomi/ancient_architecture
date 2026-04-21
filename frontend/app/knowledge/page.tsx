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
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-2">
              知识库
            </h1>
            <p className="text-cream/60">
              探索中国传统建筑的历史与文化
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary flex items-center gap-2"
            >
              <span>+</span>
              {showForm ? '取消' : '写文章'}
            </button>
          )}
        </div>

        {/* 新建文章表单 */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h3 className="text-xl font-serif font-bold text-gold mb-6">撰写新文章</h3>
            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入文章标题"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  摘要
                </label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="请输入文章摘要（可选）"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  封面图片 URL（可选）
                </label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cream/80 mb-2">
                  内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入文章内容..."
                  required
                  rows={10}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {submitting ? '发布中...' : '发布文章'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
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
                  <div key={i} className="card p-6 animate-pulse">
                    <div className="h-6 bg-wood-700/50 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-wood-700/50 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-wood-700/50 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-4">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`card p-6 w-full text-left transition-all hover:scale-102 ${
                      selectedArticle?.id === article.id ? 'border-gold' : ''
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
                        <h3 className="text-lg font-serif font-bold text-gold mb-2">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-cream/70 text-sm mb-2 line-clamp-2">
                            {article.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-cream/50">
                          <span>{new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-6xl mb-4">📝</p>
                <p className="text-cream/60 mb-4">还没有文章</p>
                {user && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-gold hover:text-gold-light transition-colors"
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
              <div className="card p-6 sticky top-24">
                {selectedArticle.cover_image && (
                  <img
                    src={selectedArticle.cover_image}
                    alt={selectedArticle.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-serif font-bold text-gold mb-4">
                  {selectedArticle.title}
                </h2>
                <p className="text-cream/50 text-sm mb-6">
                  {new Date(selectedArticle.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="text-cream/80 text-sm whitespace-pre-wrap mb-6">
                  {selectedArticle.content}
                </div>
                {user?.id === selectedArticle.author_id && (
                  <button
                    onClick={() => handleDeleteArticle(selectedArticle.id)}
                    className="w-full py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    删除文章
                  </button>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center sticky top-24">
                <p className="text-4xl mb-4">📖</p>
                <p className="text-cream/60">选择一个文章查看详情</p>
              </div>
            )}
          </div>
        </div>

        {/* 返回链接 */}
        <div className="mt-12 text-center">
          <Link href="/home" className="text-cream/60 hover:text-gold transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
