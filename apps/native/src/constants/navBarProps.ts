const TABS = [
  { name: 'microorganismTest', href: '/microorganismTest', label: '미생물 검사' },
  { name: 'record', href: '/record', label: '기록' },
  { name: 'home', href: '/', label: '홈' },
  { name: 'shopping', href: '/shopping', label: '쇼핑' },
  { name: 'mypage', href: '/myPage', label: '마이' },
];
const TAB_IMAGES: Record<string, ReturnType<typeof require>> = {
  home: require('../../assets/images/tab-home.png'),
  microorganismTest: require('../../assets/images/tab-microorganismTest.png'),
  record: require('../../assets/images/tab-record.png'),
  shopping: require('../../assets/images/tab-shopping.png'),
  mypage: require('../../assets/images/tab-mypage.png'),
};
const TAB_HEIGHT = 71;

export const NAV_BAR_PROPS = {
  TABS,
  TAB_IMAGES,
  TAB_HEIGHT,
};
