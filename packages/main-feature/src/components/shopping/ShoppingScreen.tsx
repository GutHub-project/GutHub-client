import { colors } from '@repo/tailwind-config/colors';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// 더미 데이터
const PRODUCTS = [
  {
    id: 1,
    name: '제품이름',
    rating: 4.5,
    reviews: 2302,
    description: '[1+1]구성 블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 2,
    name: '제품이름',
    rating: 4.5,
    reviews: 2302,
    description: '[1+1]구성 블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 3,
    name: '제품이름',
    rating: 4.5,
    reviews: 2302,
    description: '[1+1]구성 블드라 프로바이오틱스',
    price: 28200,
  },
];

const HEALTH_PRODUCTS = [
  {
    id: 1,
    rank: 1,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 2,
    rank: 2,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
  {
    id: 3,
    rank: 3,
    category: '에너지 어썸리',
    name: '블드라 프로바이오틱스',
    price: 28200,
  },
];

export const ShoppingScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logo}>GutHub | 하단남의 하루</Text>
        <View style={styles.streak}>
          <Text style={styles.streakText}>4일</Text>
          <Text style={styles.fireEmoji}>🔥</Text>
        </View>
      </View>

      {/* 검색바 */}
      <View style={styles.searchBar}>
        <Text style={styles.searchPlaceholder}>제품명 또는 성분명 검색</Text>
      </View>

      {/* 전체랭킹 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>전체랭킹</Text>
          <Text style={styles.sectionMore}>{'>'}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.bookmark}>
                <Text>🔖</Text>
              </View>
              <View style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.rating}>{product.rating}</Text>
                <Text style={styles.reviews}>({product.reviews.toLocaleString()})</Text>
              </View>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>{product.price.toLocaleString()}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 변비형에게 지금 인기있는 건강기능식품 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.healthTitle}>
            <Text style={styles.highlighted}>&apos;변비형&apos;</Text> 에게 지금 인기있는 건강기능식품
          </Text>
          <Text style={styles.sectionMore}>{'>'}</Text>
        </View>
        <View style={styles.healthList}>
          {HEALTH_PRODUCTS.map((item) => (
            <View key={item.id} style={styles.healthItem}>
              <Text style={styles.rank}>{item.rank}</Text>
              <View style={styles.healthImage} />
              <View style={styles.healthInfo}>
                <Text style={styles.healthCategory}>{item.category}</Text>
                <Text style={styles.healthName}>{item.name}</Text>
              </View>
              <Text style={styles.healthPrice}>{item.price.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  fireEmoji: {
    fontSize: 16,
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors['Black-600'],
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors['Black-800'],
  },
  sectionMore: {
    fontSize: 18,
    color: colors['Black-600'],
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  productCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  bookmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-800'],
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  star: {
    fontSize: 12,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  reviews: {
    fontSize: 11,
    color: colors['Black-600'],
  },
  productDescription: {
    fontSize: 12,
    color: colors['Black-700'],
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors['Black-800'],
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors['Black-800'],
    flex: 1,
  },
  highlighted: {
    color: colors.main,
  },
  healthList: {
    paddingHorizontal: 16,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rank: {
    fontSize: 18,
    fontWeight: '700',
    color: colors['Black-800'],
    width: 30,
  },
  healthImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginRight: 12,
  },
  healthInfo: {
    flex: 1,
  },
  healthCategory: {
    fontSize: 12,
    color: colors['Black-600'],
    marginBottom: 4,
  },
  healthName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['Black-800'],
  },
  healthPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors['Black-800'],
  },
});
