'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

// 颜色图集配置
const colorPalettes = [
  { id: 'vermilion', name: '朱红', gradient: 'linear-gradient(135deg, #C73E3A 0%, #8B2500 100%)' },
  { id: 'gold', name: '明黄', gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)' },
  { id: 'azure', name: '石青', gradient: 'linear-gradient(135deg, #3A7D8C 0%, #1E5F6E 100%)' },
  { id: 'jade', name: '黛绿', gradient: 'linear-gradient(135deg, #4A6741 0%, #2D4A2E 100%)' },
  { id: 'wood', name: '木棕', gradient: 'linear-gradient(135deg, #8B6914 0%, #5D4E37 100%)' },
  { id: 'grey', name: '青灰', gradient: 'linear-gradient(135deg, #708090 0%, #4A5568 100%)' },
]

// 示例图集数据 - 等用户提供图片后替换
const galleryImages = [
  { id: 1, title: '故宫太和殿', color: 'vermilion', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80' },
  { id: 2, title: '天坛祈年殿', color: 'gold', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80' },
  { id: 3, title: '苏州园林亭台', color: 'jade', image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80' },
  { id: 4, title: '布达拉宫', color: 'vermilion', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80' },
  { id: 5, title: '寺庙石雕', color: 'wood', image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&q=80' },
  { id: 6, title: '长城秋色', color: 'grey', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80' },
  { id: 7, title: '古桥流水', color: 'azure', image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80' },
  { id: 8, title: '徽派建筑', color: 'wood', image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&q=80' },
  { id: 9, title: '石窟佛像', color: 'grey', image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80' },
]

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  useEffect(() => {
    const colorParam = searchParams.get('color')
    if (colorParam) {
      setSelectedColor(colorParam)
    }
  }, [searchParams])

  const filteredImages = selectedColor
    ? galleryImages.filter(img => img.color === selectedColor)
    : galleryImages

  const handleColorSelect = (colorId: string | null) => {
    setSelectedColor(colorId)
    const url = new URL(window.location.href)
    if (colorId) {
      url.searchParams.set('color', colorId)
    } else {
      url.searchParams.delete('color')
    }
    window.history.pushState({}, '', url)
  }

  const handleImageClick = (image: typeof galleryImages[0]) => {
    setSelectedImage(image)
  }

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [closeLightbox])

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
            图集欣赏
          </h1>
          <p className="text-cream/60 text-lg max-w-2xl mx-auto">
            探索中国传统建筑之美，按颜色发现不同的建筑风格
          </p>
        </div>

        {/* 筛选栏 */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <button
              onClick={() => handleColorSelect(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedColor === null
                  ? 'bg-gold text-[#2A1E16] shadow-lg shadow-gold/30'
                  : 'bg-wood-800/50 text-cream/70 hover:text-gold hover:bg-wood-700/50 border border-wood-700/50'
              }`}
            >
              全部
            </button>
            {colorPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => handleColorSelect(palette.id)}
                className={`group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                  selectedColor === palette.id
                    ? 'ring-2 ring-gold ring-offset-2 ring-offset-[#2A1E16]'
                    : ''
                }`}
              >
                <div
                  className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ background: palette.gradient }}
                />
                <span className="relative text-white drop-shadow-lg">
                  {palette.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 图片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => {
            const palette = colorPalettes.find(p => p.id === image.color)
            return (
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="card overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E16]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {palette && (
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full shadow-lg"
                      style={{ background: palette.gradient }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif font-bold text-gold mb-1">
                    {image.title}
                  </h3>
                  {palette && (
                    <span className="text-xs text-cream/50">{palette.name}色系</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 空状态 */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-50">🎨</div>
            <p className="text-cream/50 text-lg">
              该色系暂无图集，稍后将添加更多内容
            </p>
          </div>
        )}
      </div>

      {/* 图片预览弹窗 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#2A1E16] to-transparent">
              <h3 className="text-2xl font-serif font-bold text-gold mb-2">
                {selectedImage.title}
              </h3>
              <div className="flex items-center gap-3">
                {colorPalettes.find(p => p.id === selectedImage.color) && (
                  <>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ background: colorPalettes.find(p => p.id === selectedImage.color)?.gradient }}
                    />
                    <span className="text-cream/70">
                      {colorPalettes.find(p => p.id === selectedImage.color)?.name}色系
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
