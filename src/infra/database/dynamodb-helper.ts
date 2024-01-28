import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';

export abstract class DynamodbBaseRepository {
  protected tableName: string;

  constructor() {
    this.tableName = `${process.env.NODE_ENV}-custumers`;
  }

  protected getDynamoDBClient(): DynamoDBDocumentClient {
    const client: DynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    });

    return DynamoDBDocumentClient.from(client, {
      unmarshallOptions: {
        wrapNumbers: false,
      },
      marshallOptions: {
        convertEmptyValues: false,
        removeUndefinedValues: true,
      },
    });
  }

  protected deleteItem(params: DeleteCommandInput, options?: any) {
    return this.getDynamoDBClient().send(new DeleteCommand(params), options);
  }

  protected getItem(params: GetCommandInput, options?: any) {
    return this.getDynamoDBClient().send(new GetCommand(params), options);
  }

  protected putItem(params: PutCommandInput, options?: any) {
    return this.getDynamoDBClient().send(new PutCommand(params), options);
  }

  protected queryItems(params: QueryCommandInput, options?: any) {
    return this.getDynamoDBClient().send(new QueryCommand(params), options);
  }

  protected updateItem(params: UpdateCommandInput, options?: any) {
    return this.getDynamoDBClient().send(new UpdateCommand(params), options);
  }
}
