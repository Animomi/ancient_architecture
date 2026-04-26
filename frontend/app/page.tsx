import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 图片背景 */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-[#2A1E16]/[0.65]"></div>
      </div>

      {/* 内容层 */}
      <div className="relative z-10 text-center px-4">
        {/* 标题区域 */}
        <div className="mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-light text-gold mb-3 tracking-wide animate-slide-up">
            探索古建筑之美
          </h1>
          <p className="text-base md:text-lg text-cream/70 font-light tracking-widest animate-slide-up" style={{ animationDelay: '0.15s' }}>
            了解中国古代建筑的独特魅力与文化内涵
          </p>
        </div>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/login"
            className="px-8 py-3 bg-gold text-[#2A1E16] font-medium rounded-lg transition-all duration-300 hover:bg-gold-light hover:scale-105 hover:shadow-lg hover:shadow-gold/30"
          >
            开始探索
          </Link>
          <Link
            href="/knowledge"
            className="px-8 py-3 bg-transparent border border-gold text-gold font-medium rounded-lg transition-all duration-300 hover:bg-gold/20"
          >
            学习知识
          </Link>
        </div>
      </div>
    </main>
  )
}
