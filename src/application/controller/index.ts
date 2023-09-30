import { Request } from 'express';

import { HttpResponse } from '../../config/server/server';

export interface Controller {
  handle(req: Request): Promise<HttpResponse>;
}
