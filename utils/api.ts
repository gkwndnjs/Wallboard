import Constants from 'expo-constants';

function getApiBaseUrl(): string {
  // Prefer EAS public env var
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL as string | undefined;
  if (envBase && envBase.trim()) return envBase.trim().replace(/\/$/, '');

  // Fallback to app.json extra if present
  const extra = (Constants.expoConfig?.extra ?? {}) as { apiBaseUrl?: string };
  if (extra.apiBaseUrl && extra.apiBaseUrl.trim()) return extra.apiBaseUrl.trim().replace(/\/$/, '');

  throw new Error('API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL or extra.apiBaseUrl');
}

export async function postCreateWall(title: string): Promise<{ id: string | number }> {
  const base = getApiBaseUrl();
  const url = `${base}/wall`;

  // Backend spec: body-data['title']=<name>; use URL-encoded form
  const body = new URLSearchParams({ title }).toString();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body,
  });

  const text = await response.text();
  let data: any = undefined;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch (_) {
    // ignore JSON parse error; will fall back to text
  }

  if (!response.ok) {
    const message = data?.message || data?.error || text || `HTTP ${response.status}`;
    throw new Error(message);
  }

  const id = data?.id ?? data?.wall?.id;
  if (!id) {
    throw new Error('서버 응답에 id가 없습니다.');
  }
  return { id };
}


