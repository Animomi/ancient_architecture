'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCategories, createPost, type PostCategory } from '@/lib/supabase-square'

export default function PostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  // 加载分类
  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await getCategories()
      if (data && data.length > 0) {
        setCategories(data)
        setCategoryId(data[0].id)
      }
    }
    loadCategories()
  }, [])

  // 提交帖子
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('请输入帖子标题')
      return
    }
    if (!content.trim()) {
      setError('请输入帖子内容')
      return
    }
    if (!categoryId) {
      setError('请选择帖子分类')
      return
    }
    
    setPosting(true)
    setError('')
    
    const { data, error: postError } = await createPost(title.trim(), content.trim(), categoryId)
    
    if (postError) {
      setError('发布失败，请重试')
      setPosting(false)
      return
    }
    
    // 发布成功，跳转回广场
    router.push('/square')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/square"
          className="inline-flex items-center gap-2 text-cream/50 hover:text-gold text-sm mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回游客广场</span>
        </Link>

        {/* 发帖表单 */}
        <div className="card p-6 md:p-8">
          <h1 className="text-2xl font-serif font-bold text-gradient-gold mb-6">
            发布新帖子
          </h1>
          
          <form onSubmit={handleSubmit}>
            {/* 分类选择 */}
            <div className="mb-6">
              <label className="block text-cream/80 text-sm mb-2">选择分类</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-lg border text-sm transition-all flex flex-col items-center gap-1 ${
                      categoryId === cat.id
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-wood-600/50 bg-wood-700/30 text-cream/70 hover:border-wood-500'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 标题 */}
            <div className="mb-6">
              <label className="block text-cream/80 text-sm mb-2">
                帖子标题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入帖子标题（不超过50字）"
                className="input-field"
                maxLength={50}
              />
              <div className="text-cream/40 text-xs mt-1 text-right">{title.length}/50</div>
            </div>

            {/* 内容 */}
            <div className="mb-6">
              <label className="block text-cream/80 text-sm mb-2">
                帖子内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入帖子内容，分享你的见解..."
                className="input-field min-h-[250px] resize-none"
                maxLength={5000}
              />
              <div className="text-cream/40 text-xs mt-1 text-right">{content.length}/5000</div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* 按钮 */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/square"
                className="px-6 py-3 text-cream/70 hover:text-cream transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={posting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {posting ? '发布中...' : '发布帖子'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
