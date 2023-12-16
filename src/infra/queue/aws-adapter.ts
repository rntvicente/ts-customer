import { SNSClient } from '@aws-sdk/client-sns';

import { Logger } from '../../config/logger/logger';
import { Queue, Config } from './';

export class AwsAdapter implements Queue {
  private readonly _logger: Logger;
  private _sns!: SNSClient;

  constructor(private readonly logger: Logger) {
    this._logger = logger;
  }

  getSNSClient(): SNSClient {
    return this._sns;
  }

  init(config: Config): void {
    try {
      this._logger.info(
        `[QUEUE] init aws queue ${JSON.stringify(config.region)}`
      );

      this._sns = new SNSClient({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });
    } catch (error: any) {
      this._logger.error(`Error init aws queue - ${error.message}`);

      throw new Error(error.message);
    }
  }
}
