import { randomUUID } from 'crypto';
import { SNSClient } from '@aws-sdk/client-sns';
import { PublishCommand } from '@aws-sdk/client-sns';

import { Queue } from '../../infra/queue';
import { Logger } from '../../config/logger/logger';
import { EventDispatcher } from '../../shared/event';

export class SendEmailCostumerCreatedEvent implements EventDispatcher {
  private readonly _logger: Logger;
  private _sns!: SNSClient;

  constructor(
    private readonly awsClient: Queue,
    private readonly logger: Logger
  ) {
    this._logger = logger;
    this._sns = this.awsClient.getSNSClient();
  }

  async notify(topicArn: string, message: string): Promise<void> {
    try {
      const response = await this._sns.send(
        new PublishCommand({
          Message: message,
          TopicArn: topicArn,
          MessageGroupId: 'CustomerCReated',
          MessageDeduplicationId: randomUUID(),
        })
      );

      this._logger.info(
        // eslint-disable-next-line @typescript-eslint/dot-notation
        `[SEND EMAIL] costumer created to SNS. ${response['$metadata'].requestId}`
      );
    } catch (error: any) {
      this._logger.error(
        `[SEND EMAIL] costumer created to SNS - ${error.message}`
      );

      throw new Error(error.message);
    }
  }
}
