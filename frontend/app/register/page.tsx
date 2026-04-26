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

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 个字符')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await signUp(email, password, username)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      if (data.session) {
        router.push('/home')
        router.refresh()
      } else {
        setSuccess('注册成功！请查收验证邮件，完成邮箱验证后即可登录。')
      }
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 视频背景 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="/videos/architecture.mp4"
        />
        <div className="absolute inset-0 bg-[#2A1E16]/[0.65]"></div>
      </div>

      {/* 内容层 */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-light text-gold mb-1 tracking-wide">古建筑</h1>
            <p className="text-sm text-cream/60 font-light tracking-widest">中国传统建筑艺术展示平台</p>
          </Link>
        </div>

        {/* 注册卡片 */}
        <div className="bg-[#2A1E16]/70 backdrop-blur-md rounded-xl border border-gold/20 p-8">
          <h2 className="text-xl text-center text-gold mb-6">创建账户</h2>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="用户名"
              required
              minLength={2}
              maxLength={20}
              className="w-full bg-[#2A1E16]/80 border border-wood-600/50 rounded-lg px-4 py-3 text-cream placeholder-wood-300/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱地址"
              required
              className="w-full bg-[#2A1E16]/80 border border-wood-600/50 rounded-lg px-4 py-3 text-cream placeholder-wood-300/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码（至少6位）"
              required
              minLength={6}
              className="w-full bg-[#2A1E16]/80 border border-wood-600/50 rounded-lg px-4 py-3 text-cream placeholder-wood-300/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="确认密码"
              required
              minLength={6}
              className="w-full bg-[#2A1E16]/80 border border-wood-600/50 rounded-lg px-4 py-3 text-cream placeholder-wood-300/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-[#2A1E16] font-medium py-3 rounded-lg transition-all duration-300 hover:bg-gold-light hover:scale-[1.02] hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-cream/50 text-sm">
              已有账户？{' '}
              <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-cream/50 hover:text-cream text-sm transition-colors">
            ← 返回首页
          </Link>
        </div>
      </div>
    </main>
  )
}
