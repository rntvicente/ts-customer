import { SNS } from 'aws-sdk';

import { Logger } from '../../config/logger/logger';
import { QueueService, Config } from '.';

export class SNSAdapter implements QueueService {
  private readonly _logger: Logger;
  private _sns!: SNS;
  private _config!: Config;

  constructor(private readonly logger: Logger) {
    this._logger = logger;
  }

  updateConfig(config: Config): void {
    this._config = config;
    this._sns = new SNS(this._config);
  }

  async publishToSNS(topicArn: string, message: string): Promise<void> {
    try {
      await this._sns
        .publish({
          TopicArn: topicArn,
          Message: message,
        })
        .promise();
    } catch (error: any) {
      this._logger.error(`Error publish to SNS - ${error.message}`);
      throw new Error(error.message);
    }
  }
}
