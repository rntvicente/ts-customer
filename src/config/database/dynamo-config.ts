import * as AWS from 'aws-sdk';

export class AWSConfig {
  constructor(
    private readonly region: string,
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string
  ) {
    AWS.config.update({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }
}