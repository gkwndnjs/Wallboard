import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addMyWall, setWallTitle, addChildWall } from '@/utils/storage';

export default function CreateWallScreen() {
  const router = useRouter();
  const { parentId } = useLocalSearchParams<{ parentId?: string }>();
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      Alert.alert('알림', '담벼락 이름을 입력해 주세요.');
      return;
    }

    try {
      setSubmitting(true);
      // Local-only: generate an id and store it in "my walls"
      const newId = generateLocalWallId(trimmed);
      addMyWall(newId);
      setWallTitle(newId, trimmed);
      if (parentId && parentId.trim()) {
        addChildWall(parentId.trim(), newId);
      }
      router.replace(`/wall/${encodeURIComponent(String(newId))}`);
    } catch (error: any) {
      Alert.alert('생성 실패', error?.message ?? '알 수 없는 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

function generateLocalWallId(_: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 13;
  let out = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * alphabet.length);
    out += alphabet[idx];
  }
  return out;
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>담벼락 생성</Text>
        <Text style={styles.label}>담벼락 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 우리팀 공지판"
          value={title}
          onChangeText={setTitle}
          editable={!submitting}
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />

        <TouchableOpacity
          style={[styles.primaryButton, (submitting || title.trim().length === 0) ? styles.primaryButtonDisabled : undefined]}
          onPress={handleCreate}
          activeOpacity={0.8}
          disabled={submitting || title.trim().length === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>생성하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});


