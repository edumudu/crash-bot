import { logger } from '../logger';

export function createDatabase(name: string) {
    const request = indexedDB.open(name, 3);

    return new Promise<IDBDatabase>((resolve, reject) => {
      let db: IDBDatabase;

      request.onupgradeneeded = function (event) {
        if (!event.target) return false

        // @ts-ignore
        db = event.target.result as IDBDatabase;

        let objectStore = db.createObjectStore('bet-history', {
          keyPath: 'id',
          autoIncrement: true
        });


        objectStore.createIndex('amount', 'amount', { unique: false });
        objectStore.createIndex('cashoutMultiplier', 'cashoutMultiplier', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('isSimulated', 'isSimulated', { unique: false });
        objectStore.createIndex('crashedAt', 'crashedAt', { unique: false });

        objectStore.transaction.oncomplete = function (event) {
          logger.info("ObjectStore Created.");
        }
      }

      request.onerror = function (event) {
        reject("Problem opening DB.");
      }

      request.onsuccess = function (event) {
        if (!event.target) return reject('Problem opening DB.');

        // @ts-ignore
        db = event.target.result as IDBDatabase;

        logger.info("DB OPENED.");
        resolve(db);
      }
    })
}
