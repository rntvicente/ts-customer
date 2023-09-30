import { PutItemInput } from 'aws-sdk/clients/dynamodb';

export interface DatabaseHelper {
  add(params: PutItemInput): Promise<void>;
}
