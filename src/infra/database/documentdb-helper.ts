
export class DocumentDBHelper implements DatabaseHelper {
  private _client!: DocumentClient;
  private _url!: string;

  async connect(url: string): Promise<void> {
    this._url = url;
    this._client = new DocumentClient({ endpoint: this._url });
  }

  async disconnect(): Promise<void> {
    this._client = null as any;
  }

  async getCollection(name: string): Promise<DocumentClient> {
    if (!this._client) this.connect(this._url);

    return this._client;
  }
}