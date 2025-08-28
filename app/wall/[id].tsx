import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, FlatList, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addWallItem, getWallItems, isKnownWall, getWallTitle, getChildWalls, type WallItem } from '@/utils/storage';

export default function WallScreen() {
  const router = useRouter();
  const { id, mine } = useLocalSearchParams<{ id: string; mine?: string }>();

  const wallId = useMemo(() => (Array.isArray(id) ? id[0] : id) ?? '', [id]);
  const [valid, setValid] = useState<boolean>(false);
  const [items, setItems] = useState<WallItem[]>([]);
  const [wallTitle, setWallTitleState] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTitle, setComposeTitle] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [children, setChildren] = useState<string[]>([]);

  useEffect(() => {
    const trimmed = wallId.trim();
    if (!trimmed) {
      Alert.alert('알림', '유효하지 않은 담벼락 ID 입니다.', [
        { text: '확인', onPress: () => router.replace('/a') },
      ]);
      return;
    }

    // Local validation; if backend exists, replace with GET /wall check
    const ok = isKnownWall(trimmed);
    if (!ok) {
      Alert.alert('알림', '존재하지 않는 담벼락입니다.', [
        { text: '확인', onPress: () => router.replace('/a') },
      ]);
      return;
    }

    setValid(true);
    const all = getWallItems(trimmed);
    const showMineOnly = mine === '1';
    setItems(showMineOnly ? all.filter((it) => it.ownedByMe) : all);
    setWallTitleState(getWallTitle(trimmed));
    setChildren(getChildWalls(trimmed));
  }, [wallId]);

  const submitItem = () => {
    const t = title.trim();
    const m = message.trim();
    if (!t || !m) return;
    const newItem = addWallItem(wallId, { title: t, message: m });
    setItems((prev) => [newItem, ...prev]);
    setTitle('');
    setMessage('');
  };

  const submitCompose = () => {
    const t = composeTitle.trim();
    const m = composeMessage.trim();
    if (!t || !m) return;
    const newItem = addWallItem(wallId, { title: t, message: m });
    setItems((prev) => [newItem, ...prev]);
    setComposeTitle('');
    setComposeMessage('');
    setComposeOpen(false);
  };

  if (!valid) {
    return <SafeAreaView style={styles.safeArea} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{wallTitle ?? '담벼락'} ({wallId})</Text>

        {mine === '1' ? (
          <>
            <FlatList
              data={items}
              keyExtractor={(it) => it.id}
              numColumns={2}
              columnWrapperStyle={{ gap: 16 }}
              contentContainerStyle={{ paddingBottom: 24, gap: 16 }}
              ListEmptyComponent={<Text style={styles.empty}>아직 글이 없습니다.</Text>}
              renderItem={({ item }) => (
                <View style={styles.gridCard}>
                  <Text style={styles.gridTitle}>{item.title}</Text>
                  <Text style={styles.gridMessage}>{item.message}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.addWallButton} onPress={() => setComposeOpen((v) => !v)}>
              <Text style={styles.addWallButtonText}>담벼락 추가하기</Text>
            </TouchableOpacity>

            {composeOpen && (
              <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })}>
                <View style={styles.inputCard}>
                  <Text style={styles.sectionTitle}>새 글 작성</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="제목"
                    value={composeTitle}
                    onChangeText={setComposeTitle}
                    returnKeyType="next"
                  />
                  <TextInput
                    style={[styles.input, styles.multiline]}
                    placeholder="내용"
                    value={composeMessage}
                    onChangeText={setComposeMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    returnKeyType="done"
                    onSubmitEditing={submitCompose}
                  />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={[styles.primaryButton, (!composeTitle.trim() || !composeMessage.trim()) ? styles.primaryButtonDisabled : undefined, { flex: 1 }]} onPress={submitCompose} disabled={!composeTitle.trim() || !composeMessage.trim()}>
                      <Text style={styles.primaryButtonText}>등록</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.outlineButton, { flex: 1 }]} onPress={() => setComposeOpen(false)}>
                      <Text style={styles.outlineButtonText}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            )}

            {children.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>하위 담벼락</Text>
                <FlatList
                  data={children}
                  keyExtractor={(cid) => cid}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                  renderItem={({ item: cid }) => (
                    <TouchableOpacity style={styles.childChip} onPress={() => router.push({ pathname: '/wall/[id]', params: { id: cid, mine: '1' } })}>
                      <Text style={styles.childChipText}>{getWallTitle(cid) ?? cid}</Text>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ paddingVertical: 8 }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })}>
              <View style={styles.inputCard}>
                <Text style={styles.sectionTitle}>새 글 작성</Text>
                <TextInput
                  style={styles.input}
                  placeholder="제목"
                  value={title}
                  onChangeText={setTitle}
                  returnKeyType="next"
                />
                <TextInput
                  style={[styles.input, styles.multiline]}
                  placeholder="내용"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  returnKeyType="done"
                  onSubmitEditing={submitItem}
                />
                <TouchableOpacity style={[styles.primaryButton, (!title.trim() || !message.trim()) ? styles.primaryButtonDisabled : undefined]} onPress={submitItem} disabled={!title.trim() || !message.trim()}>
                  <Text style={styles.primaryButtonText}>등록</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>

            <FlatList
              data={items}
              keyExtractor={(it) => it.id}
              ListEmptyComponent={<Text style={styles.empty}>아직 글이 없습니다.</Text>}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemMessage}>{item.message}</Text>
                  {mine !== '1' && (
                    <Text style={styles.itemDate}>{new Date(item.createdAt).toLocaleString()}</Text>
                  )}
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          </>
        )}

        <TouchableOpacity style={styles.outlineButton} onPress={() => router.back()}>
          <Text style={styles.outlineButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    gap: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  multiline: {
    height: 100,
  },
  empty: { color: '#777', marginTop: 8 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    gap: 4,
  },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  itemMessage: { fontSize: 14, color: '#333' },
  itemDate: { fontSize: 12, color: '#888' },
  primaryButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  outlineButton: {
    marginTop: 'auto',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: { color: '#111', fontSize: 16, fontWeight: '600' },
  gridCard: {
    flex: 1,
    backgroundColor: '#8bf490',
    borderRadius: 12,
    padding: 16,
    minHeight: 140,
  },
  gridTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  gridMessage: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  addWallButton: {
    marginTop: 8,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWallButtonText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  childChip: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  childChipText: { fontSize: 14, fontWeight: '700', color: '#333' },
});


