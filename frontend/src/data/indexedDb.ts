/**
 * Browser IndexedDB Database Engine for CodeX CRM
 * Implements persistent client-side object stores for offline-first resilience.
 */

const DB_NAME = 'CodeXCrmDatabase';
const DB_VERSION = 1;

export class LocalIndexedDb {
  private db: IDBDatabase | null = null;
  private isSupported: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  public async open(): Promise<IDBDatabase | null> {
    if (!this.isSupported) return null;
    if (this.db) return this.db;

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const stores = [
            'leads',
            'contacts',
            'companies',
            'deals',
            'tasks',
            'events',
            'documents',
            'communications',
            'activities',
          ];

          stores.forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
        };

        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };

        request.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.open();
    if (!db) return [];

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result as T[]) || []);
        req.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }

  public async put<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    const db = await this.open();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async putBulk<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
    const db = await this.open();
    if (!db || items.length === 0) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  public async delete(storeName: string, id: string): Promise<void> {
    const db = await this.open();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}

export const indexedDb = new LocalIndexedDb();
