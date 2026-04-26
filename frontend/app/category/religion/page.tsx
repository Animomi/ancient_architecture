import CategoryDetail from '@/components/CategoryDetail'

const religionData = {
  title: '宗教建筑',
  subtitle: '佛教、道教等宗教场所的建筑艺术',
  icon: '🛕',
  coverImage: '/images/categories/religious.jpg',
  description: '宗教建筑是中国古代建筑艺术的重要组成部分，佛教、道教、伊斯兰教等宗教建筑各具特色。寺庙建筑通常采用伽蓝七堂制布局，以山门、天王殿、大雄宝殿等为主要建筑。石窟寺则是将石壁凿刻成窟龛，内置佛像，融建筑、雕塑、壁画于一体，展现了古代工匠的高超技艺。塔作为佛教建筑的重要元素，有楼阁式、密檐式、单层式等多种形式。',
  examples: [
    {
      name: '布达拉宫',
      slug: 'potala-palace',
      description: '位于西藏拉萨的宫堡式建筑群，海拔3700米，是世界上海拔最高、规模最大的宫殿式建筑，集宫殿、城堡、寺院于一体。',
      image: '/images/categories/religious.jpg'
    },
    {
      name: '莫高窟',
      slug: 'mogao-caves',
      description: '位于甘肃敦煌，是中国现存规模最大、内容最丰富的佛教艺术宝库，现有洞窟735个，壁画4.5万平方米。',
      image: '/images/categories/religious.jpg'
    },
    {
      name: '少林寺',
      slug: 'shaolin-temple',
      description: '位于河南嵩山，是中国佛教禅宗祖庭，以少林功夫闻名于世，寺内塔林是历代高僧的墓塔群。',
      image: '/images/categories/religious.jpg'
    },
    {
      name: '悬空寺',
      slug: 'hanging-temple',
      description: '位于山西恒山，建于峭壁之上，半悬空中，是国内现存唯一的佛、道、儒三教合一的独特古刹。',
      image: '/images/categories/religious.jpg'
    },
    {
      name: '白马寺',
      slug: 'white-horse-temple',
      description: '位于河南洛阳，是中国第一座佛教寺院，被尊为"中国第一古刹"，有"祖庭"和"释源"之誉。',
      image: '/images/categories/religious.jpg'
    },
    {
      name: '武当山古建筑群',
      slug: 'wudang-mountains',
      description: '位于湖北丹江口，是中国道教名山，建筑群始建于唐代，各类古建筑涵盖皇家庙观、民间祠庙等多种类型。',
      image: '/images/categories/religious.jpg'
    }
  ]
}

export default function ReligionPage() {
  return <CategoryDetail category={religionData} />
}
