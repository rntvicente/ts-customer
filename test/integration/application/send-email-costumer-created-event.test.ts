import Chance from 'chance';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

import { Logger } from '../../../src/config/logger/logger';
import { Config, Queue } from '../../../src/infra/queue';

import { SendEmailCostumerCreatedEvent } from '../../../src/application/event/send-email-costumer-created-event';

const snsClient = new SNSClient({ region: 'us-east-1' });
const snsClientMock = mockClient(snsClient);

const makeQueue = () => {
  class AwsAdapterStub implements Queue {
    init(config: Config): void {
      throw new Error('Method not implemented.');
    }

    getSNSClient(): SNSClient {
      return snsClient;
    }
  }

  return new AwsAdapterStub();
};

const makeLooger = () => {
  class LoggerStub implements Logger {
    info(message: string): void {
      console.info(message);
    }

    error(message: string): void {
      console.error(message);
    }

    warn(message: string): void {
      console.warn(message);
    }
  }

  return new LoggerStub();
};

const makeSUT = () => {
  const queue = makeQueue();
  const logger = makeLooger();
  const sut = new SendEmailCostumerCreatedEvent(queue, logger);

  return { sut, queue };
};

describe.only('# Send Email Costumer Created Event', () => {
  const chance = Chance();
  const topicArn = process.env.TOPIC_ARN || '';

  beforeEach(() => {
    snsClientMock.reset();
  });

  it('Deve lançar error quando SNS falhar', async () => {
    const { sut } = makeSUT();
    snsClientMock.on(PublishCommand).rejects('fail mock');

    await expect(() => sut.notify(topicArn, chance.paragraph()))
      .rejects
      .toThrow('Internal Server Error: fail mock');
  });

  it('Deve registrar uma mensagem corretamente quando chamar o metodo send do SNS', async () => {
    const { sut } = makeSUT();

    snsClientMock.on(PublishCommand).resolvesOnce({
      MessageId: chance.hash(),
      $metadata: { requestId: chance.hash() }
    });

    await sut.notify(topicArn, 'any_message');

    expect(snsClientMock).toHaveReceivedCommandWith(PublishCommand, { Message: 'any_message' });
  });
});