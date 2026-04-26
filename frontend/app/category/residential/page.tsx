import CategoryDetail from '@/components/CategoryDetail'

const residentialData = {
  title: '民居建筑',
  subtitle: '各地特色传统民居建筑',
  icon: '🏠',
  coverImage: '/images/categories/residential.jpg',
  description: '中国传统民居建筑是劳动人民智慧的结晶，因地制宜，因材致用，形成了各具特色的建筑风格。北方四合院规整严谨，南方土楼聚族而居，徽派建筑白墙黛瓦，吊脚楼依山傍水，窑洞冬暖夏凉，蒙古包便于游牧。这些民居建筑不仅是居住空间，更是地域文化和民族特色的载体，反映了先民与自然和谐共处的生存智慧。',
  examples: [
    {
      name: '北京四合院',
      slug: 'beijing-siwuheyuan',
      description: '北京传统民居的代表，以南北中轴线对称布局，由东、西、南、北四面房屋围合而成，院墙封闭自成天地。',
      image: '/images/categories/residential.jpg'
    },
    {
      name: '徽派建筑',
      slug: 'huizhou-architecture',
      description: '安徽民居的典型风格，以黛瓦、粉壁、马头墙为特色，砖雕、木雕、石雕工艺精湛，建筑群错落有致。',
      image: '/images/categories/residential.jpg'
    },
    {
      name: '福建土楼',
      slug: 'fujian-tulou',
      description: '客家人的传统民居建筑，圆形或方形的大型夯土建筑，可居住数百人，具有防御和聚居双重功能。',
      image: '/images/categories/residential.jpg'
    },
    {
      name: '吊脚楼',
      slug: 'stilted-house',
      description: '湘西、黔东南等地区的传统民居，依山就势，干栏式建筑，下层架空，上层居住，通风防潮。',
      image: '/images/categories/residential.jpg'
    },
    {
      name: '山西大院',
      slug: 'shanxi-mansion',
      description: '晋商宅院的典型代表，如乔家大院，建筑规模宏大，工艺精湛，体现了北方民居的豪迈气派。',
      image: '/images/categories/residential.jpg'
    },
    {
      name: '开平碉楼',
      slug: 'kaiping-diaolou',
      description: '广东开平地区的乡土建筑，中西合璧，既有中国传统乡村建筑的特点，又吸收了西方建筑艺术。',
      image: '/images/categories/residential.jpg'
    }
  ]
}

export default function ResidentialPage() {
  return <CategoryDetail category={residentialData} />
}
