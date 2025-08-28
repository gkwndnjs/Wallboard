import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const BACKGROUND_IMAGE = require('../assets/images/splash-icon.png');

export default function AScreen() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState<number>(0);

  const goNext = () => {
    if (pageIndex < 2) {
      setPageIndex(pageIndex + 1);
    } else {
      router.replace('/b');
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} blurRadius={20} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{`온보딩 ${pageIndex + 1}`}</Text>
          <Text style={styles.subtitle}>간단한 소개 텍스트 영역입니다.</Text>
        </View>

        <View style={styles.paginationContainer}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, pageIndex === i ? styles.dotActive : undefined]} />
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={goNext} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>{pageIndex < 2 ? '다음' : '시작하기'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


