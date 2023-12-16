import { SNSClient } from '@aws-sdk/client-sns';

export interface Queue {
  init(config: Config): void;
  getSNSClient(): SNSClient;
}

export type Config = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};
