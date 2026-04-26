import CategoryDetail from '@/components/CategoryDetail'

const bridgeData = {
  title: '桥梁建筑',
  subtitle: '古代桥梁工程的智慧结晶',
  icon: '🌉',
  coverImage: '/images/categories/bridge.jpg',
  description: '中国古代桥梁建造技术领先世界，创造了多种桥型，包括梁桥、拱桥、索桥等。赵州桥屹立千年不倒，展现了隋代工匠的卓越智慧；卢沟桥石狮千态万状，堪称艺术珍品；风雨桥集桥、廊、亭于一体，兼具实用与美观。古代桥梁不仅解决交通问题，更与山水环境融为一体，成为园林景观的重要组成部分。',
  examples: [
    {
      name: '赵州桥',
      description: '位于河北赵县，又名安济桥，建于隋代大业年间，是世界上现存最早、保存最完好的敞肩式石拱桥。',
      image: '/images/categories/bridge.jpg'
    },
    {
      name: '卢沟桥',
      description: '位于北京丰台，因桥上石狮众多而闻名，有"卢沟桥的石狮子——数不清"的歇后语，是"七七事变"的发生地。',
      image: '/images/categories/bridge.jpg'
    },
    {
      name: '洛阳桥',
      description: '位于福建泉州，是宋代梁式石桥的代表作，建桥时采用的筏型基础和减水桩技术，开创了桥梁建筑史上的先河。',
      image: '/images/categories/bridge.jpg'
    },
    {
      name: '湘江风雨桥',
      description: '广西程阳风雨桥是侗族桥梁建筑的代表，集桥、廊、亭于一体，不用一钉一铆，全凭榫卯连接。',
      image: '/images/categories/bridge.jpg'
    },
    {
      name: '宝带桥',
      description: '位于江苏苏州，始建于唐代，是江南最长的多孔石桥，全长317米，53孔，造型优美。',
      image: '/images/categories/bridge.jpg'
    },
    {
      name: '悬桥',
      description: '四川泸定桥是著名的铁链悬桥，桥面铺板，两侧护栏，1935年红军长征"飞夺泸定桥"使其名垂青史。',
      image: '/images/categories/bridge.jpg'
    }
  ]
}

export default function BridgePage() {
  return <CategoryDetail category={bridgeData} />
}
