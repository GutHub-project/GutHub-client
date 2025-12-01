import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { COLORS } from '../../constants/colors';
import { NAV_BAR_PROPS } from '../../constants/navBarProps';

export function NavBar() {
  const router = useRouter();

  const handlePress = (href: string) => {
    router.push(href as `/${string}`);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundContainer}>
        <View style={styles.shadowBackground} />
      </View>

      <View style={styles.tabContainer}>
        {NAV_BAR_PROPS.TABS.map((tab) => {
          const isHome = tab.name === 'home';

          return (
            <TouchableOpacity
              key={tab.label}
              style={styles.tabButton}
              onPress={() => handlePress(tab.href)}
              activeOpacity={0.7}
            >
              {isHome ? (
                <View style={styles.homeTabContainer}>
                  <View style={styles.homeCircle}>
                    <Image source={NAV_BAR_PROPS.TAB_IMAGES.home} style={styles.homeIconImage} resizeMode="contain" />
                  </View>
                  <Text style={styles.homeLabel}>{tab.label}</Text>
                </View>
              ) : (
                <View style={styles.tabContent}>
                  <Image
                    source={NAV_BAR_PROPS.TAB_IMAGES[tab.name as keyof typeof NAV_BAR_PROPS.TAB_IMAGES]}
                    style={styles.tabIconImage}
                    resizeMode="contain"
                  />
                  <View style={{ height: 3 }} />
                  <Text style={styles.tabLabel}>{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.curveContainer} pointerEvents="none">
        <View style={styles.curveShadow}>
          <Svg width="100%" height={72} viewBox="0 0 100 50" style={styles.curveSvg}>
            <Path d="M0,50 A50,57 0 0,1 100,50" fill="white" stroke="none" />
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: NAV_BAR_PROPS.TAB_HEIGHT,
    backgroundColor: 'white',
  },
  backgroundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: NAV_BAR_PROPS.TAB_HEIGHT,
  },
  shadowBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: NAV_BAR_PROPS.TAB_HEIGHT,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  curveContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -31,
    top: -45,
    width: 62,
    height: 72,
    zIndex: 1,
  },
  curveShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  curveSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 20,
  },
  homeIconImage: {
    width: 26,
    height: 24,
  },
  homeLabel: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.BLACK_800,
    zIndex: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  tabIconImage: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.BLACK_500,
  },
});
