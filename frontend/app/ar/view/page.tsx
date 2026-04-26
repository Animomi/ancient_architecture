'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const ARModelViewer = dynamic(() => import('@/components/ARModelViewer'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mx-auto mb-4" />
        <p>加载 AR 组件中...</p>
      </div>
    </div>
  )
})

const buildingsAR = [
  { id: 1, name: '太和殿', modelUrl: '/models/taihe-palace.glb' },
  { id: 2, name: '悬空寺', modelUrl: '/models/shanxixuankongsi.glb' },
  { id: 3, name: '彩塑供养菩萨', modelUrl: '/models/saisupusa.glb' },
  { id: 4, name: '北京长城', modelUrl: '/models/beijingchangchen.glb' },
  { id: 5, name: '黄鹤楼', modelUrl: '/models/huanghelou.glb' },
  { id: 6, name: '滕王阁', modelUrl: '/models/tengwangge.glb' },
  { id: 7, name: '四合院', modelUrl: '/models/siheyuan.glb' },
  { id: 8, name: '大雁塔', modelUrl: '/models/dayanta.glb' },
  { id: 9, name: '廓如亭', modelUrl: '/models/guoruting.glb' }
]

function ARViewContent() {
  const searchParams = useSearchParams()
  const modelId = searchParams.get('model')
  const building = buildingsAR.find(b => b.id === Number(modelId))

  if (!building) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-900 to-wood-800 flex items-center justify-center p-8">
        <div className="card p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-serif font-bold text-gold mb-2">模型未找到</h2>
          <p className="text-cream/60 mb-4">该建筑模型不存在或已被移除</p>
          <a href="/ar" className="text-gold hover:underline">
            返回 AR 展厅
          </a>
        </div>
      </div>
    )
  }

  return <ARModelViewer modelUrl={building.modelUrl} modelName={building.name} />
}

export default function ARViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
      </div>
    }>
      <ARViewContent />
    </Suspense>
  )
}
