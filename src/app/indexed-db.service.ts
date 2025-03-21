import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  
})
export class IndexedDbService {
  private dbName = 'paintDataDB';
  private storeName = 'canvasData';

  constructor() { }

 
  openDb() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };

      
      request.onsuccess = (event: any) => resolve(event.target.result);

      
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  saveData(data: any) {
    return this.getAllData().then(allData => {
      const newId = allData.length > 0 ? Math.max(...allData.map(d => d.id)) + 1 : 1;
      data.id = newId;
  
      return this.openDb().then(db => {
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(this.storeName, 'readwrite');
          const store = transaction.objectStore(this.storeName);
          store.put(data);  
  
          transaction.oncomplete = () => resolve();
          transaction.onerror = (event: any) => reject(event.target.error);
        });
      });
    });
  }
  

  
  getAllData() {
    return this.openDb().then(db => {
      return new Promise<any[]>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event: any) => reject(event.target.error);
      });
    });
  }
}
