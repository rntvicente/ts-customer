import { Request } from 'express';

import { HttpResponse } from '../server/server';

export interface Controller {
  handle(req: Request): Promise<HttpResponse>;
}
