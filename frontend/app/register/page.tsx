'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, signUp } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    // 验证密码长度
    if (password.length < 6) {
      setError('密码长度至少为 6 个字符')
      return
    }

    setLoading(true)

    // 注册用户
    const { data, error: signUpError } = await signUp(email, password, username)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // 如果是直接登录成功（邮箱确认关闭的情况）
      if (data.session) {
        router.push('/home')
        router.refresh()
      } else {
        // 需要邮箱验证
        setSuccess('注册成功！请查收验证邮件，完成邮箱验证后即可登录。')
      }
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-5xl mb-4 block">🏯</span>
            <h1 className="text-3xl font-serif font-bold text-gradient-gold">古建筑</h1>
          </Link>
        </div>

        {/* 注册卡片 */}
        <div className="card p-8">
          <h2 className="text-2xl font-serif text-center text-gold mb-6">创建账户</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                minLength={2}
                maxLength={20}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码（至少6位）"
                required
                minLength={6}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cream/80 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
                required
                minLength={6}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  注册中...
                </>
              ) : (
                '注册'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cream/60 text-sm">
              已有账户？{' '}
              <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-cream/60 hover:text-cream text-sm transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </main>
  )
}
