import CategoryDetail from '@/components/CategoryDetail'

const greatwallData = {
  title: '长城关隘',
  subtitle: '军事防御建筑的杰出代表',
  icon: '🏯',
  coverImage: '/images/categories/greatwall.jpg',
  description: '长城是中国古代最伟大的军事防御工程，始于春秋战国，历经两千多年的修筑与完善。长城依山势而建，蜿蜒起伏，气势雄伟。关隘是长城的核心防御设施，选址险要，建筑坚固，如山海关、嘉峪关、居庸关等。长城不仅是军事防线，更是中华民族坚韧不屈精神的象征，体现了古代劳动人民的伟大创造力。',
  examples: [
    {
      name: '八达岭长城',
      description: '位于北京延庆，是明代长城最具代表性的段落，设施完备，景色壮观，是最受游客欢迎的长城景区。',
      image: '/images/categories/greatwall.jpg'
    },
    {
      name: '山海关',
      description: '位于河北秦皇岛，有"天下第一关"之称，是明长城的东北起点，长城与大海在此交汇。',
      image: '/images/categories/greatwall.jpg'
    },
    {
      name: '嘉峪关',
      description: '位于甘肃嘉峪关市，是明长城最西端的关口，地势险要，建筑雄伟，有"天下雄关"之称。',
      image: '/images/categories/greatwall.jpg'
    },
    {
      name: '居庸关',
      description: '位于北京昌平，是长城的重要关口，地处太行山与燕山交汇处，自古为北京西北的重要屏障。',
      image: '/images/categories/greatwall.jpg'
    },
    {
      name: '慕田峪长城',
      description: '位于北京怀柔，长城风格独特，敌楼密集，植被丰富，是明长城的精华段落之一。',
      image: '/images/categories/greatwall.jpg'
    },
    {
      name: '司马台长城',
      description: '位于北京密云，是明代长城中保存最完整的段落之一，2012年被英国《泰晤士报》评为"全球不容错过的25处风景之首"。',
      image: '/images/categories/greatwall.jpg'
    }
  ]
}

export default function GreatwallPage() {
  return <CategoryDetail category={greatwallData} />
}
