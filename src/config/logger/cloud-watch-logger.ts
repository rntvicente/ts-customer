import winston from 'winston';
import CloudWatchTransport from 'winston-aws-cloudwatch';

import { Logger } from './logger';

export class CloudWatchLogger implements Logger {
  private readonly logger: winston.Logger;

  constructor(
    private readonly logGroupName: string,
    private readonly logStreamName: string
  ) {
    this.logger = winston.createLogger({
      transports: [
        new CloudWatchTransport({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          createLogGroup: true,
          createLogStream: true,
          submissionInterval: 2000,
          submissionRetryCount: 1,
          batchSize: 20,
          awsConfig: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
          },
          formatLog: (item) =>
            `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`,
        }),
        new winston.transports.Console(),
      ],
    });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }
}
