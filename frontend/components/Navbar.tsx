'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase, signOut, getCurrentUser } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/home', label: '首页' },
    { href: '/categories', label: '建筑分类' },
    { href: '/knowledge', label: '知识库' },
    { href: '/ai', label: 'AI 助手' },
    { href: '/3d', label: '3D 展示' },
  ]

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center gap-2">
              <span className="text-2xl">🏯</span>
              <span className="text-xl font-serif font-bold text-gold">古建筑</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-gold'
                    : 'text-cream/70 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-wood-700 animate-pulse"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-cream/80 hover:text-gold transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold text-sm font-medium">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm">{user.user_metadata?.username || user.email?.split('@')[0]}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 card py-2 hidden group-hover:block">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-cream/80 hover:text-gold hover:bg-wood-700/50 transition-colors"
                  >
                    个人中心
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-wood-700/50 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-cream/70 hover:text-gold transition-colors">
                  登录
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  注册
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-cream/80 hover:text-gold"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-wood-900/95 border-t border-wood-700/50">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-gold bg-gold/10'
                    : 'text-cream/70 hover:text-gold hover:bg-wood-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
