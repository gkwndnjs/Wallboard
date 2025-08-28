import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { addMyWall, addFavoriteWall } from '@/utils/storage';

export default function BScreen() {
  const router = useRouter();
  const [joinId, setJoinId] = useState('');

  const goMyWalls = () => router.push('/my-walls');
  const goFavorites = () => router.push('/favorites');
  const joinWall = () => {
    const trimmed = joinId.trim();
    if (!trimmed) return;
    router.push(`/wall/${encodeURIComponent(trimmed)}`);
  };

  // Demo helpers to quickly add items (optional for now)
  const demoAddMine = () => {
    if (!joinId.trim()) return;
    addMyWall(joinId.trim());
    setJoinId('');
  };
  const demoAddFav = () => {
    if (!joinId.trim()) return;
    addFavoriteWall(joinId.trim());
    setJoinId('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.card} onPress={goMyWalls} activeOpacity={0.8}>
            <Text style={styles.cardTitle}>내가 만든 담벼락</Text>
            <Text style={styles.cardSubtitle}>내가 생성한 담벼락 모음</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={goFavorites} activeOpacity={0.8}>
            <Text style={styles.cardTitle}>즐겨찾기 담벼락</Text>
            <Text style={styles.cardSubtitle}>즐겨찾기한 담벼락 모음</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.createCard} onPress={() => router.push('/wall/create')} activeOpacity={0.8}>
          <Text style={styles.createTitle}>담벼락 생성</Text>
          <Text style={styles.createSubtitle}>새 담벼락을 만들어 보세요</Text>
        </TouchableOpacity>

        <View style={styles.joinSection}>
          <Text style={styles.sectionTitle}>담벼락 참여</Text>
          <TextInput
            placeholder="담벼락 ID 입력"
            value={joinId}
            onChangeText={setJoinId}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={joinWall}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={joinWall} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>참여하기</Text>
          </TouchableOpacity>

          <View style={styles.demoRow}>
            <TouchableOpacity style={styles.outlineButton} onPress={demoAddMine}>
              <Text style={styles.outlineButtonText}>내 담벼락에 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineButton} onPress={demoAddFav}>
              <Text style={styles.outlineButtonText}>즐겨찾기에 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#ddd',
    fontSize: 13,
  },
  joinSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  createCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  createTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  createSubtitle: {
    color: '#777',
    fontSize: 13,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
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
  demoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
});


