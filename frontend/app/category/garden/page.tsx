import CategoryDetail from '@/components/CategoryDetail'

const gardenData = {
  title: '园林建筑',
  subtitle: '私家园林与皇家园林的典范之作',
  icon: '🏡',
  coverImage: '/images/categories/garden.jpg',
  description: '中国古典园林是中华文化的瑰宝，讲究"虽由人作，宛自天开"的造园理念。园林建筑将山水、建筑、花木融为一体，创造出移步换景、步移景异的艺术效果。皇家园林规模宏大，建筑华丽，如颐和园、承德避暑山庄；私家园林则小巧精致，意境深远，以苏州园林为代表。园林中的亭台楼阁、廊桥水榭，不仅具有实用功能，更是园林景观的重要组成部分。',
  examples: [
    {
      name: '拙政园',
      slug: 'humble-administrator-garden',
      description: '位于苏州，是苏州最大的古典园林，以水为中心，山水萦绕，厅榭精美，被誉为"中国园林之母"。',
      image: '/images/categories/garden.jpg'
    },
    {
      name: '承德避暑山庄',
      slug: 'mountain-resort',
      description: '清代皇帝夏季避暑和处理政务的场所，是中国现存最大的皇家园林，集江南塞北风光于一体。',
      image: '/images/categories/garden.jpg'
    },
    {
      name: '留园',
      slug: 'liuyuan-garden',
      description: '位于苏州，以建筑艺术著称，厅堂、走廊、粉墙、洞门与假山、水池、花木组成变化无穷的园林景观。',
      image: '/images/categories/garden.jpg'
    },
    {
      name: '网师园',
      slug: 'master-of-nets-garden',
      description: '位于苏州，是苏州中型园林的杰出代表，以小巧精致著称，体现了"小园极则"的造园艺术。',
      image: '/images/categories/garden.jpg'
    },
    {
      name: '狮子林',
      slug: 'lion-grove-garden',
      description: '位于苏州，因园内石峰形似狮子而得名，假山群峰起伏，曲折盘旋，犹如迷宫。',
      image: '/images/categories/garden.jpg'
    },
    {
      name: '圆明园',
      slug: 'old-summer-palace',
      description: '曾为清代皇家园林，有"万园之园"美誉，荟萃了中外园林精华，后遭英法联军焚毁，现为遗址公园。',
      image: '/images/categories/garden.jpg'
    }
  ]
}

export default function GardenPage() {
  return <CategoryDetail category={gardenData} />
}
