import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getMyWalls, getWallTitle } from '@/utils/storage';

export default function MyWallsScreen() {
  const router = useRouter();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    setData(getMyWalls());
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>내가 만든 담벼락</Text>
        <FlatList
          data={data}
          keyExtractor={(id) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                router.push({ pathname: '/wall/[id]', params: { id: item, mine: '1' } })
              }
            >
              <Text style={styles.itemTitle}>{getWallTitle(item) ?? '(제목 없음)'}</Text>
              <Text style={styles.itemSubtitle}>{item}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>아직 담벼락이 없습니다.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  itemSubtitle: { marginTop: 4, fontSize: 12, color: '#777' },
  empty: { color: '#777', marginTop: 20 },
});


