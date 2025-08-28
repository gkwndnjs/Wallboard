type WallId = string;
export type WallItem = {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  ownedByMe?: boolean;
};

const MEMORY_STORE: Record<string, string> = {};

function getLocalStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {}
  return null;
}

function readKey<T>(key: string, fallback: T): T {
  const ls = getLocalStorage();
  try {
    const raw = ls ? ls.getItem(key) : MEMORY_STORE[key];
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeKey<T>(key: string, value: T): void {
  const data = JSON.stringify(value);
  const ls = getLocalStorage();
  if (ls) ls.setItem(key, data);
  else MEMORY_STORE[key] = data;
}

const MY_WALLS_KEY = 'myWalls';
const FAVORITE_WALLS_KEY = 'favoriteWalls';
const WALL_ITEMS_PREFIX = 'wallItems:'; // per-wall storage
const WALL_META_KEY = 'wallMeta'; // { [id]: { title } }
const WALL_CHILDREN_KEY = 'wallChildren'; // { [parentId]: WallId[] }

export function getMyWalls(): WallId[] {
  return readKey<WallId[]>(MY_WALLS_KEY, []);
}

export function addMyWall(id: WallId): void {
  const list = getMyWalls();
  if (!list.includes(id)) {
    writeKey(MY_WALLS_KEY, [id, ...list]);
  }
}

export function getFavoriteWalls(): WallId[] {
  return readKey<WallId[]>(FAVORITE_WALLS_KEY, []);
}

export function addFavoriteWall(id: WallId): void {
  const list = getFavoriteWalls();
  if (!list.includes(id)) {
    writeKey(FAVORITE_WALLS_KEY, [id, ...list]);
  }
}

export function removeFavoriteWall(id: WallId): void {
  const list = getFavoriteWalls().filter((w) => w !== id);
  writeKey(FAVORITE_WALLS_KEY, list);
}

export function isKnownWall(id: WallId): boolean {
  const mine = getMyWalls();
  const favs = getFavoriteWalls();
  return mine.includes(id) || favs.includes(id);
}

function getWallItemsKey(id: WallId): string {
  return `${WALL_ITEMS_PREFIX}${id}`;
}

export function getWallItems(id: WallId): WallItem[] {
  return readKey<WallItem[]>(getWallItemsKey(id), []);
}

export function addWallItem(id: WallId, item: { title: string; message: string }): WallItem {
  const list = getWallItems(id);
  const newItem: WallItem = {
    id: generateItemId(),
    title: item.title,
    message: item.message,
    createdAt: Date.now(),
    ownedByMe: true,
  };
  writeKey(getWallItemsKey(id), [newItem, ...list]);
  return newItem;
}

function generateItemId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type WallMeta = { title?: string };

export function getWallMeta(): Record<WallId, WallMeta> {
  return readKey<Record<WallId, WallMeta>>(WALL_META_KEY, {});
}

export function setWallTitle(id: WallId, title: string): void {
  const meta = getWallMeta();
  meta[id] = { ...(meta[id] ?? {}), title };
  writeKey(WALL_META_KEY, meta);
}

export function getWallTitle(id: WallId): string | undefined {
  const meta = getWallMeta();
  return meta[id]?.title;
}

export function getChildWalls(parentId: WallId): WallId[] {
  const map = readKey<Record<WallId, WallId[]>>(WALL_CHILDREN_KEY, {});
  return map[parentId] ?? [];
}

export function addChildWall(parentId: WallId, childId: WallId): void {
  const map = readKey<Record<WallId, WallId[]>>(WALL_CHILDREN_KEY, {});
  const list = map[parentId] ?? [];
  if (!list.includes(childId)) {
    map[parentId] = [childId, ...list];
    writeKey(WALL_CHILDREN_KEY, map);
  }
}


