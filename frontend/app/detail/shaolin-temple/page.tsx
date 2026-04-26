import ArchitectureDetailPage from '@/components/ArchitectureDetailPage'

const shaolinTempleData = {
  name: '少林寺',
  subtitle: '禅宗祖庭 ·功夫之源',
  category: '宗教建筑',
  tags: ['河南嵩山', '佛教禅宗', '少林功夫', '古刹'],
  coverImage: '/images/categories/religious.jpg',
  galleryImages: [
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
  ],
  overview: '少林寺位于河南省郑州市登封市西北15公里的中岳嵩山南麓，是中国佛教禅宗祖庭和中国功夫的发源地。少林寺始建于北魏太和十九年（495年），孝文帝为安顿印度高僧跋陀而建。32年后，达摩祖师在此面壁九年，创立禅宗。少林寺被誉为"天下第一名刹"，其少林功夫闻名于世。',
  history: [
    {
      title: '北魏创建',
      content: '北魏太和十九年（495年），孝文帝为安顿从古印度来华的高僧跋陀，在嵩山建立少林寺。跋陀在少林寺传播小乘佛教，被尊为少林寺的奠基人和第一代祖师。',
    },
    {
      title: '达摩祖师与禅宗创立',
      content: '约527年，南印度高僧达摩从海路来到中国，在少林寺后面的五乳峰洞中面壁九年，创立了禅宗。达摩被认为是禅宗东土初祖，他的"直指人心，见性成佛"思想对后世影响深远。',
    },
    {
      title: '少林功夫的形成与发展',
      content: '唐初，少林十三棍僧救秦王的故事使少林寺名扬天下。此后少林功夫不断发展，逐渐形成了以棍法为代表的独特武术体系。明清时期，少林功夫达到鼎盛，形成现在所见的众多拳法。',
    },
    {
      title: '近现代的传承与保护',
      content: '1928年，军阀石友三火烧少林寺，大雄宝殿等主要建筑被毁。中华人民共和国成立后，少林寺得到修复和保护。1994年，少林寺被列为世界文化遗产申报项目。2010年，少林文化走进联合国教科文组织。',
    },
  ],
  features: [
    {
      title: '禅武合一的独特寺院',
      content: '少林寺是中国佛教寺院中唯一以"禅"和"武"闻名于世的寺院。寺内建筑包括常住院、塔林、初祖庵、二祖庵等。常住院是少林寺的主体建筑，中轴线建筑依次为山门、天王殿、大雄宝殿、藏经阁等。',
    },
    {
      title: '少林塔林的墓塔群',
      content: '塔林位于少林寺西约250米处，是历代少林寺高僧的墓塔群。现有墓塔232座，面积近2万平方米，是国内最大的塔林。塔的形制多样，记载了从唐到清千余年的建筑风格演变。',
    },
    {
      title: '少林功夫的武学体系',
      content: '少林功夫是一个庞大的武术体系，传说有七十二绝技，实际上流传可查的拳术、器械、对练等功法多达数百种。少林功夫讲究禅武合一，以武悟禅，是中华武术的重要组成部分。',
    },
  ],
  culture: '少林寺作为禅宗祖庭，在中国佛教史上具有崇高地位。达摩祖师带来的禅宗思想深刻影响了中国文化，与儒、道思想融合，形成了具有中国特色的禅文化。少林功夫作为中国武术的代表，不仅是一种体育运动，更是一种文化符号，体现了中华民族的精神气质。',
  location: {
    address: '河南省郑州市登封市西北15公里中岳嵩山南麓',
    coordinates: '34.5082° N, 112.9197° E',
    openingHours: '08:00-17:00（全年无休）',
    ticketInfo: '门票80元（含塔林），索道需另购票',
  },
  slug: 'shaolin-temple',
}

export default function ShaolinTemplePage() {
  return <ArchitectureDetailPage architecture={shaolinTempleData} />
}
