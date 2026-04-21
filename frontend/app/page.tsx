import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
      <div className="text-center px-4">
        {/* Logo 装饰 */}
        <div className="mb-8 animate-fade-in">
          <span className="text-6xl">🏯</span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-gradient-gold mb-4 animate-slide-up">
          古建筑
        </h1>

        {/* 副标题 */}
        <p className="text-xl md:text-2xl text-cream/80 mb-12 font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
          中国传统建筑艺术展示平台
        </p>

        {/* 装饰线 */}
        <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          <span className="text-gold text-2xl">☷</span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/login"
            className="btn-primary text-lg"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="btn-secondary text-lg"
          >
            注册
          </Link>
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>
    </main>
  )
}
