import { Bet } from 'src/types';

type BetEntry = Bet & {
  isSimulated: boolean;
  crashedAt: number;
}

export class BetService {
  private db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.db = db
  }

  public createBet(betEntry: BetEntry) {
    const transaction = this.db.transaction('bet-history', 'readwrite');
    const objectStore = transaction.objectStore('bet-history');

    objectStore.add({
      ...betEntry,
      createdAt: new Date().toISOString()
    });
  }
}
