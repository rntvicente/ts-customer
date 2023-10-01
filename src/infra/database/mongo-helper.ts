import { Collection, MongoClient } from 'mongodb';

import { DatabaseHelper } from './database-helper';

export class MongoHelper implements DatabaseHelper {
  private _client!: MongoClient;
  private _url!: string;

  async connect(url: string): Promise<void> {
    this._url = url;
    this._client = await MongoClient.connect(this._url);
  }

  async disconnect(): Promise<void> {
    await this._client?.close();
  }

  async getCollection(name: string): Promise<Collection> {
    if (!this._client) this.connect(this._url);

    return this._client.db().collection(name);
  }
}
