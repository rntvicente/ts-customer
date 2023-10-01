import { Collection } from 'mongodb';

export interface DatabaseHelper {
  connect(url: string): Promise<void>;
  disconnect(): Promise<void>;
  getCollection(name: string): Promise<Collection>;
}
