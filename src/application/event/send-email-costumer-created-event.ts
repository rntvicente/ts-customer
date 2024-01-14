import { randomUUID } from 'crypto';
import { SNSClient } from '@aws-sdk/client-sns';
import { PublishCommand } from '@aws-sdk/client-sns';

import { Queue } from '../../infra/queue';
import { EventDispatcher } from '../../shared/event';
import { InternalServerError } from '../../shared/error/internal-server-error';
import { Logger } from '../../config/logger/logger';

export class SendEmailCostumerCreatedEvent implements EventDispatcher {
  private readonly _logger: Logger;
  private readonly _sns!: SNSClient;

  constructor(
    private awsClient: Queue,
    private logger: Logger
  ) {
    this._logger = this.logger;
    this._sns = this.awsClient.getSNSClient();
  }

  async notify(topicArn: string, message: string): Promise<void> {
    try {
      const response = await this._sns.send(
        new PublishCommand({
          Message: message,
          TopicArn: topicArn,
          MessageGroupId: 'CustomerCreated',
          MessageDeduplicationId: randomUUID(),
        })
      );

      this._logger.info(
        // eslint-disable-next-line @typescript-eslint/dot-notation
        `[SEND EMAIL] costumer created. ${response['$metadata']?.requestId}`
      );
    } catch (error: any) {
      this._logger.error(
        `[SEND EMAIL] fail costumer created - ${error.message}`
      );

      throw new InternalServerError(error.message);
    }
  }
}
