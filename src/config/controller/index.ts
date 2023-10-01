import { Request } from 'express';

import { HttpResponse } from '../../infra/server/server';

export interface Controller {
  handle(req: Request): Promise<HttpResponse>;
}
