import ArchitectureDetailPage from '@/components/ArchitectureDetailPage'

const potalaPalaceData = {
  name: '布达拉宫',
  subtitle: '藏传佛教圣地 · 世界文化遗产',
  category: '宗教建筑',
  tags: ['西藏拉萨', '藏传佛教', '宫殿式建筑', '世界遗产'],
  coverImage: '/images/categories/religious.jpg',
  galleryImages: [
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
  ],
  overview: '布达拉宫位于西藏自治区拉萨市区的玛布日山上，海拔3700米，是世界上海拔最高、规模最大的宫殿式建筑群。布达拉宫始建于公元7世纪松赞干布时期，后经历代扩建形成今日规模。宫堡依山而建，群楼重叠，气势雄伟，是藏式建筑的杰出代表，也是藏族人民心中的圣地。1994年，布达拉宫被联合国教科文组织列入世界遗产名录。',
  history: [
    {
      title: '松赞干布始建',
      content: '公元7世纪，吐蕃赞普松赞干布迎娶文成公主和尺尊公主后，决定在红山上建造宫殿。传说宫内有999间房屋，加上山顶的一间共1000间，象征天上宫阙。宫殿建成后，成为吐蕃王朝的政治中心。',
    },
    {
      title: '历代扩建与重修',
      content: '9世纪吐蕃王朝崩溃后，布达拉宫逐渐荒废。1645年，五世达赖喇嘛在废墟上重新修建白宫。1690年，第司桑结嘉措主持修建红宫，1693年完工，形成今日布达拉宫的基本格局。此后历代达赖喇嘛都有所增建。',
    },
    {
      title: '近代的沧桑变化',
      content: '1959年西藏民主改革后，布达拉宫回到人民手中。1961年，布达拉宫被列为全国重点文物保护单位。1988年，国家拨巨款对布达拉宫进行大规模维修，1994年主体维修工程竣工。2001年又进行了第二次大规模维修。',
    },
    {
      title: '世界遗产与保护',
      content: '1994年，布达拉宫被联合国教科文组织列入世界遗产名录。2000年，布达拉宫扩展项目（大昭寺）也被列入世界遗产。2005年，布达拉宫进行了壁画抢救保护工程。布达拉宫的保护工作一直在持续进行。',
    },
  ],
  features: [
    {
      title: '宫堡合一的宏伟建筑',
      content: '布达拉宫依山而建，整个建筑群分为白宫和红宫两部分。白宫为历代达赖喇嘛的行政宫殿和起居宫，红宫为佛殿和灵塔殿。宫殿建筑海拔最高点达3767米，是世界上海拔最高的宫殿建筑。',
    },
    {
      title: '藏式建筑的典范',
      content: '布达拉宫在建筑艺术上融汇了藏式、汉式和尼泊尔式的风格。红宫外墙涂以赭红色，白宫外墙涂以白色，色彩对比鲜明。宫顶覆盖鎏金铜瓦，脊饰瑞兽，展示了藏族工匠的高超技艺。',
    },
    {
      title: '珍贵的壁画与文物',
      content: '布达拉宫内保存有大量珍贵的壁画、雕塑、唐卡和经书。红宫内的五世达赖喇嘛灵塔高14.85米，用黄金3721公斤包裹。此外还有八座灵塔和各种法器、佛像，均为无价之宝。',
    },
  ],
  culture: '布达拉宫是藏族文化最杰出的代表，承载着藏传佛教的深厚文化内涵。宫内供奉的佛像、壁画、经书记录了西藏的历史与宗教发展。布达拉宫不仅是藏传佛教的信徒朝圣地，也是研究西藏历史、文化、建筑艺术的珍贵实物资料。',
  location: {
    address: '西藏自治区拉萨市城关区北京中路35号',
    coordinates: '29.6575° N, 91.1171° E',
    openingHours: '09:00-16:00（周一至周五），09:00-12:00（周六）',
    ticketInfo: '旺季门票200元，淡季门票100元',
  },
  slug: 'potala-palace',
}

export default function PotalaPalacePage() {
  return <ArchitectureDetailPage architecture={potalaPalaceData} />
}
