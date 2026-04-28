import CategoryDetail from '@/components/CategoryDetail'

const palaceData = {
  title: '宫殿建筑',
  subtitle: '古代帝王居住理政的建筑群，以宏伟壮丽著称',
  icon: '🏛️',
  coverImage: '/images/categories/palace.jpg',
  description: '宫殿建筑是中国古代建筑艺术的最高表现形式，体现了皇权的威严与中华文化的精髓。故宫作为明清两代的皇宫，是世界上现存规模最大、保存最完整的木质结构古建筑群。宫殿建筑群通常采用中轴对称的布局，以太和殿为核心，体现了"普天之下，莫非王土"的统治思想。建筑采用红墙黄瓦，飞檐斗拱，雕梁画栋，极尽奢华。',
  examples: [
    {
      name: '故宫博物院',
      slug: 'forbidden-city',
      description: '位于北京的中轴线上，是明清两代的皇家宫殿，建筑群占地72万平方米，建筑面积约15万平方米，拥有大小宫殿七十多座，房屋九千余间。',
      image: '/images/categories/palace-forbidden-city.jpg' // TODO: 待上传图片替换
    },
    {
      name: '天坛',
      slug: 'temple-of-heaven',
      description: '明清皇帝祭天、祈谷的场所，其圆形祭坛与方形围墙的设计象征着"天圆地方"的宇宙观，是古代建筑艺术的杰作。',
      image: '/images/categories/palace-temple-of-heaven.jpg' // TODO: 待上传图片替换
    },
    {
      name: '颐和园',
      slug: 'summer-palace',
      description: '中国现存规模最大的皇家园林，以昆明湖和万寿山为主体，集江南园林精华于一身，被誉为"皇家园林博物馆"。',
      image: '/images/categories/palace-summer-palace.jpg' // TODO: 待上传图片替换
    },
    {
      name: '沈阳故宫',
      slug: 'shenyang-palace',
      description: '清朝入关前的皇宫，是中国现存两座完整的宫殿建筑群之一，融合了满、汉、蒙古等民族的建筑风格。',
      image: '/images/categories/palace-shenyang-palace.jpg' // TODO: 待上传图片替换
    },
    {
      name: '太和殿',
      slug: 'taihe-palace',
      description: '故宫中轴线上最宏伟的建筑，是皇帝举行重大典礼的场所，殿内金砖铺地，宝座居中，尽显皇家威严。',
      image: '/images/categories/palace-taihe-palace.jpg' // TODO: 待上传图片替换
    },
    {
      name: '中和殿',
      slug: 'zhonghe-palace',
      description: '位于太和殿与保和殿之间，是皇帝前往太和殿前的休息场所，殿名取自《礼记》"中和"之意。',
      image: '/images/categories/palace-zhonghe-palace.jpg' // TODO: 待上传图片替换
    }
  ]
}

export default function PalacePage() {
  return <CategoryDetail category={palaceData} />
}
