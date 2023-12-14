export interface Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface QueueService {
  updateConfig(config: Config): void;
  publishToSNS(topicArn: string, message: string): Promise<void>;
}
