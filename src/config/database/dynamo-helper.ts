import * as AWS from 'aws-sdk';

import { DatabaseHelper } from './database-helper';
import { Logger } from '../logger/logger';
import { Customer } from '../../domain/customer-entity';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';

export class DynamoHelper implements DatabaseHelper {
  private readonly _client: AWS.DynamoDB.DocumentClient;

  constructor(private readonly logger: Logger) {
    this._client = new AWS.DynamoDB.DocumentClient();
  }

  async add(params: PutItemInput): Promise<void> {
    this.logger.info(`[DATABASE] inserting ${JSON.stringify(params)}`);
    await this._client.put(params).promise();

    this.logger.info('[DATABASE] inserted customer successfully')
  }
}
