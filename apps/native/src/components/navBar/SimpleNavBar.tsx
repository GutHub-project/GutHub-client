import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SimpleNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'home', path: '/', label: '홈', icon: '🏠' },
    { name: 'shopping', path: '/shopping', label: '쇼핑', icon: '🛒' },
    { name: 'record', path: '/record', label: '기록', icon: '📝' },
    { name: 'mypage', path: '/myPage', label: '마이', icon: '👤' },
  ];

  const handleTabPress = (tab: typeof tabs[0]) => {
    setActiveTab(tab.name);
    onNavigate(tab.path);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          height: 70 + Math.max(insets.bottom, 10),
        }
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
  activeLabel: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
