import helmet from 'helmet';
import express, { Application, NextFunction, Request, Response } from 'express';
import { Server as HttpServer } from 'http';

import { BadRequestError } from '../../shared/error/bad-request-error';
import { Logger } from '../../config/logger/logger';
import { HttpMethod, Server } from './server';

export class ExpressAdapter implements Server {
  private readonly _app: Application;
  private _server!: HttpServer;
  private readonly _logger: Logger;

  constructor(private readonly logger: Logger) {
    this._logger = logger;
    this._app = express();

    this._app.use(helmet());
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: false }));

    this._app.use((req: Request, res: Response, next: NextFunction) => {
      this._logger.info(`Request ${req.method}:${req.url}`);
      next();
    });
  }

  on(method: HttpMethod, url: string, callback: Function): void {
    this._app[method](url, async (req: Request, res: Response) => {
      try {
        const { statusCode, body } = await callback(req, res);
        res.status(statusCode).json(body);
      } catch (error: any) {
        this._logger.error(
          `Request ${method.toUpperCase()} Error - ${error.message}`
        );

        if (error instanceof BadRequestError) {
          return res.status(400).json({ message: error.message });
        }

        return res.status(422).json({ message: error.message });
      }
    });
  }

  start(port: number): void {
    this._server = this._app.listen(port, () =>
      this._logger.info(`Starting server at ${port}`)
    );
  }

  close(): void {
    this._server.close(() => {
      this.logger.warn(`Server stopping`);
    });
  }

  getApp(): Application {
    return this._app;
  }
}
