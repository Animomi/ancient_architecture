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
    
    // #region agent debug log
    fetch('http://127.0.0.1:7464/ingest/d0370acf-0e49-4487-9b7c-abf162b0a30a', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-Debug-Session-Id': '791e96'},
      body: JSON.stringify({
        sessionId: '791e96',
        location: 'square/post/page.tsx:handleSubmit',
        message: '开始发帖请求',
        data: { title, categoryId, contentLength: content.length },
        timestamp: Date.now(),
        runId: 'initial-debug'
      })
    }).catch(() => {});
    // #endregion
    
    const { data, error: postError } = await createPost(title.trim(), content.trim(), categoryId)
    
    // #region agent debug log
    fetch('http://127.0.0.1:7464/ingest/d0370acf-0e49-4487-9b7c-abf162b0a30a', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-Debug-Session-Id': '791e96'},
      body: JSON.stringify({
        sessionId: '791e96',
        location: 'square/post/page.tsx:handleSubmit:result',
        message: '发帖请求结果',
        data: { 
          success: !postError, 
          error: postError?.message || null,
          errorDetails: postError?.details || null,
          errorHint: postError?.hint || null,
          returnedData: data ? { id: data.id, title: data.title } : null
        },
        timestamp: Date.now(),
        runId: 'initial-debug'
      })
    }).catch(() => {});
    // #endregion
    
    if (postError) {
      // 显示更详细的错误信息用于调试
      const detailedError = postError.details || postError.hint || postError.message
      setError(`发布失败: ${detailedError || '请重试'}`)
      setPosting(false)
      return
    }
    
    // 发布成功，跳转回广场
    router.push('/square')
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(90, 75, 60, 0.65), rgba(100, 80, 65, 0.72)), 
                        url('/images/square-post-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/square"
          className="inline-flex items-center gap-2 text-amber-100/80 hover:text-amber-400 text-sm mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回游客广场</span>
        </Link>

        {/* 发帖表单 */}
        <div className="bg-[#4A3828]/[0.88] backdrop-blur-md rounded-2xl p-6 md:p-8 border border-amber-600/30 shadow-xl">
          <h1 className="text-2xl font-serif font-bold text-gradient-gold mb-6">
            发布新帖子
          </h1>
          
          <form onSubmit={handleSubmit}>
            {/* 分类选择 */}
            <div className="mb-6">
              <label className="block text-amber-100/80 text-sm mb-2">选择分类</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-lg border text-sm transition-all flex flex-col items-center gap-1 ${
                      categoryId === cat.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                        : 'border-amber-600/30 bg-[#5A4838]/60 text-cream/80 hover:border-amber-500/50 hover:bg-[#5A4838]/80'
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
              <label className="block text-amber-100/80 text-sm mb-2">
                帖子标题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入帖子标题（不超过50字）"
                className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
                maxLength={50}
              />
              <div className="text-cream/50 text-xs mt-1 text-right">{title.length}/50</div>
            </div>

            {/* 内容 */}
            <div className="mb-6">
              <label className="block text-amber-100/80 text-sm mb-2">
                帖子内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入帖子内容，分享你的见解..."
                className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all resize-none min-h-[250px]"
                maxLength={5000}
              />
              <div className="text-cream/50 text-xs mt-1 text-right">{content.length}/5000</div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* 按钮 */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/square"
                className="px-6 py-3 text-cream/70 hover:text-amber-300 transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={posting}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
