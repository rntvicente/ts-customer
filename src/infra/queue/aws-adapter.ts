import { SNSClient } from '@aws-sdk/client-sns';

import { InternalServerError } from '../../shared/error/internal-server-error';
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
  
  setSNSClient(sns: SNSClient) {
    this._sns = sns;
  }

  init(config: Config): void {
    try {
      this._logger.info(`Starting AWS Client ${JSON.stringify(config.region)}`);

      this._sns = new SNSClient({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });
    } catch (error: any) {
      this._logger.error(`Fail starting AWS Client - ${error.message}`);

      throw new InternalServerError(error.message);
    }
  }
}
