import type { Backup } from '../../core';

interface FilePickerAccept {
  description?: string;
  accept: Record<string, string[]>;
}
interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: FilePickerAccept[];
}
type PermissionMode = { mode?: 'read' | 'readwrite' };

declare global {
  interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
  interface FileSystemHandle {
    queryPermission?: (descriptor?: PermissionMode) => Promise<PermissionState>;
    requestPermission?: (descriptor?: PermissionMode) => Promise<PermissionState>;
  }
}

/** Browsers that can pick and rewrite a single file (Chromium desktop + Android
 *  Chrome 132+ / Samsung Internet). Everything else falls back to manual export. */
export function fileBackupSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function';
}

const DB_NAME = 'allocatto-backup';
const STORE = 'handles';
const HANDLE_KEY = 'file';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = run(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/** File handles are structured-cloneable, so IndexedDB can persist them across
 *  sessions — localStorage (JSON only) cannot. */
export function saveBackupHandle(handle: FileSystemFileHandle): Promise<void> {
  return withStore('readwrite', (store) => store.put(handle, HANDLE_KEY));
}

export function loadBackupHandle(): Promise<FileSystemFileHandle | null> {
  return withStore<FileSystemFileHandle | undefined>('readonly', (store) =>
    store.get(HANDLE_KEY),
  ).then((handle) => handle ?? null);
}

export function clearBackupHandle(): Promise<void> {
  return withStore('readwrite', (store) => store.delete(HANDLE_KEY));
}

/** Prompt the user to choose/create the backup file (needs a user gesture). */
export async function chooseBackupFile(): Promise<FileSystemFileHandle | null> {
  if (!window.showSaveFilePicker) return null;
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'allocatto-backup.allocatto',
      types: [{ description: 'Allocatto backup', accept: { 'application/json': ['.allocatto'] } }],
    });
    await saveBackupHandle(handle);
    return handle;
  } catch {
    return null; // user cancelled the picker
  }
}

/** Read-write permission on the saved handle. Silent by default; pass request
 *  (only inside a user gesture) to re-prompt if it lapsed. */
export async function hasWritePermission(
  handle: FileSystemFileHandle,
  request = false,
): Promise<boolean> {
  const descriptor: PermissionMode = { mode: 'readwrite' };
  if ((await handle.queryPermission?.(descriptor)) === 'granted') return true;
  if (request && (await handle.requestPermission?.(descriptor)) === 'granted') return true;
  return false;
}

export async function writeBackupToFile(handle: FileSystemFileHandle, backup: Backup): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(backup, null, 2));
  await writable.close();
}
