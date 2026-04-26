import ArchitectureDetailPage from '@/components/ArchitectureDetailPage'

const hangingTempleData = {
  name: '悬空寺',
  subtitle: '三教合一 · 恒山第一奇观',
  category: '宗教建筑',
  tags: ['山西恒山', '佛道儒合寺', '悬崖建筑', '古建筑奇观'],
  coverImage: '/images/categories/religious.jpg',
  galleryImages: [
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
  ],
  overview: '悬空寺位于山西省大同市浑源县恒山金龙峡西侧的翠屏峰峭壁间，俗称"悬空寺"，整座寺院悬于半空，是国内现存唯一的佛、道、儒三教合一的独特古刹。悬空寺始建于北魏太和年间（约491年），距今已有1500多年历史。全寺有殿阁四十余间，最大落差约50米，利用力学原理半插飞梁为基，巧借岩石暗托，是古代建筑艺术的杰作。',
  history: [
    {
      title: '北魏太和年间创建',
      content: '北魏太和年间（约491年），一位名叫了然的禅师在此开凿石洞，建立悬空寺。当时正值北魏孝文帝推行汉化政策，佛教、道教、儒教三教并立，悬空寺正是这一历史背景下的产物。',
    },
    {
      title: '历代重修与扩建',
      content: '悬空寺在历史上有"三分散"之说，即"三分靠建，七分靠护"。历代都有修缮，但基本保持了原建风格。唐开元年间，李白曾游历至此，书写"壮观"二字。现存建筑多为明清遗物。',
    },
    {
      title: '保存至今的奇迹',
      content: '1500多年来，悬空寺经历了无数风雨、战乱和自然灾害，却依然悬挂在悬崖之上。1982年，悬空寺被列为全国重点文物保护单位。2010年，美国《时代》周刊将其列入"世界十大最危险建筑"。',
    },
    {
      title: '现代的保护与开放',
      content: '为了保护这座珍贵的古建筑，近年在下方修建了水泥台阶，并安装了防护网。2016年，悬空寺安装了实时监测系统，24小时监控建筑状态。游客需按单行线参观，以减少对建筑的损害。',
    },
  ],
  features: [
    {
      title: '半插飞梁的力学奇迹',
      content: '悬空寺的建造采用了"半插飞梁为基"的技巧。工匠们在岩石上凿出横向洞眼，插入木质飞梁，再在飞梁上铺设木板作为基础。这种设计使整座建筑的重心落在半插的飞梁上，极其巧妙。',
    },
    {
      title: '三教合一的独特布局',
      content: '悬空寺将佛、道、儒三教合于一寺，在国内极为罕见。寺内最高处的三教殿内同时供奉释迦牟尼、老子和孔子，体现了三教融合的思想。佛教的庄严、道教的神秘、儒教的中和在这里和谐共存。',
    },
    {
      title: '"壮观"二字的由来',
      content: '诗仙李白游览悬空寺后，被其气势所震撼，写下了"壮观"二字。但传说李白觉得"壮"字不够表达其意，在"壮"字旁边多加了一点，因此现在看到的"壮观"二字，"壮"字多一点。',
    },
  ],
  culture: '悬空寺是中国古代建筑智慧的结晶，体现了工匠们因地制宜、巧借地形的设计思想。它不仅是建筑奇迹，更是三教融合的见证。在中国历史上，佛道儒三教虽有争论，但也有融合，悬空寺正是这种文化包容精神的物质载体。',
  location: {
    address: '山西省大同市浑源县恒山金龙峡西侧翠屏峰',
    coordinates: '39.6624° N, 113.7189° E',
    openingHours: '08:30-17:30（旺季），08:30-17:00（淡季）',
    ticketInfo: '门票15元，登临费100元（需另行购买）',
  },
  slug: 'hanging-temple',
}

export default function HangingTemplePage() {
  return <ArchitectureDetailPage architecture={hangingTempleData} />
}
