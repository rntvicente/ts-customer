import { Request } from 'express';

import { HttpResponse } from '../server/server';

export interface Controller {
  handler(req: Request): Promise<HttpResponse>;
}
