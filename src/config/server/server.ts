export type HttpMethod = 'post' | 'get' | 'put' | 'patch' | 'delete';

export type HttpResponse = {
  statusCode: number;
  body: any;
};

export interface Server {
  start(port: number): void;
  close(): void;
  on(method: HttpMethod, url: string, callback: Function): void;
}
