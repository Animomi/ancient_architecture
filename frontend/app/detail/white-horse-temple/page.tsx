import ArchitectureDetailPage from '@/components/ArchitectureDetailPage'

const whiteHorseTempleData = {
  name: '白马寺',
  subtitle: '中国第一古刹 · 释源祖庭',
  category: '宗教建筑',
  tags: ['河南洛阳', '佛教传入', '东汉古寺', '祖庭'],
  coverImage: '/images/categories/religious.jpg',
  galleryImages: [
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
    '/images/categories/religious.jpg',
  ],
  overview: '白马寺位于河南省洛阳市老城区东约12公里处，是中国第一座佛教寺院，被尊为"中国第一古刹"，有"祖庭"和"释源"之誉。白马寺始建于东汉永平十一年（68年），由汉明帝敕令建造，是佛教传入中国后修建的第一座官办寺院，被誉为中国佛教的"释源"和"祖庭"。寺内保存有大量历代碑刻和建筑，是研究中国佛教史的重要实物资料。',
  history: [
    {
      title: '东汉永平年间创建',
      content: '东汉永平七年（64年），汉明帝夜梦金人，身长丈六，顶有白光，飞绕殿庭。次日早朝，大臣傅毅解梦说此乃西方之佛。于是汉明帝派遣使者蔡愔、秦景等十八人西行求佛。永平十年（67年），使者在大月氏遇到天竺高僧摄摩腾、竺法兰，迎请佛经和佛像回国。永平十一年（68年），汉明帝敕令在洛阳城外修建寺院，因驮载佛经佛像的白马而得名"白马寺"。',
    },
    {
      title: '佛教在中国的传播中心',
      content: '白马寺建成后，成为中国佛教传播的中心。高僧摄摩腾、竺法兰在此翻译佛经，传授佛法。中国第一部汉文佛经《四十二章经》就在此译出。此后，白马寺一直是佛教在中国传播的重要基地。',
    },
    {
      title: '历代兴衰与重建',
      content: '白马寺在历史上多次遭遇破坏和重建。东汉末年董卓火烧洛阳，寺院被毁。曹魏、西晋时期有所恢复。北魏时期，武则天曾大规模扩建白马寺。唐代武宗灭佛时再次遭到破坏。宋代进行了大规模重建。',
    },
    {
      title: '近代的保护与现状',
      content: '民国时期，白马寺进行了修缮。1931年和1938年分别对部分建筑进行了维修。1952年和1973年进行了较大规模的修复工程。1984年，白马寺成立了佛学研究机构。2013年，白马寺成为全国重点文物保护单位。',
    },
  ],
  features: [
    {
      title: '中国第一座佛寺的布局',
      content: '白马寺保持了"伽蓝七堂制"的典型布局。中轴线上依次为山门、天王殿、大佛殿、大雄殿、接引殿、毗卢阁。两侧有钟鼓楼和廊房。寺内古树参天，环境清幽，是典型的中国佛寺布局。',
    },
    {
      title: '齐云塔的唐代遗风',
      content: '齐云塔位于白马寺东约200米处，是白马寺的标志性建筑。该塔为方形密檐式砖塔，共13层，高约25米。齐云塔建于金大定十五年（1175年），是白马寺现存最古老的建筑之一。',
    },
    {
      title: '清凉台的历史遗迹',
      content: '清凉台是白马寺内一处高台建筑，据说原为汉明帝与皇后共读佛经之处。台上建有高阁，是白马寺的标志性景观之一。清凉台两侧有摄摩腾、竺法兰两高僧的陵墓。',
    },
  ],
  culture: '白马寺作为中国佛教的"释源"和"祖庭"，在中国佛教史上具有不可替代的地位。佛教从印度传入中国后，与中国本土文化融合发展，形成了具有中国特色的佛教。白马寺见证了这一文化融合的起点，其意义远超建筑本身。',
  location: {
    address: '河南省洛阳市老城区东约12公里处',
    coordinates: '34.7328° N, 112.5833° E',
    openingHours: '07:30-18:30（夏季），08:00-17:30（冬季）',
    ticketInfo: '门票35元（含寺院和齐云塔）',
  },
  slug: 'white-horse-temple',
}

export default function WhiteHorseTemplePage() {
  return <ArchitectureDetailPage architecture={whiteHorseTempleData} />
}
