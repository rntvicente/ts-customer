/* eslint-disable @typescript-eslint/no-shadow */
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { CloudWatchLogger } from '../config/logger/cloud-watch-logger';
import { Create } from '../application/create/create-usecase';
import { CreateCustomerController } from '../application/create/create-customer-controller';
import { AwsAdapter } from '../infra/queue/aws-adapter';
import { DynamodbCustomerAdapter } from '../infra/repository/customer-dynamodb-adapter';
import { SendEmailCostumerCreatedEvent } from '../application/event/send-email-costumer-created-event';

const logger = new CloudWatchLogger('[CUSTOMER]', '[LAMBDA]');
const sns = new AwsAdapter(logger);
const event = new SendEmailCostumerCreatedEvent(sns, logger);
const repository = new DynamodbCustomerAdapter();
const usecase = new Create(event, repository, logger);

const createCustomerController = new CreateCustomerController(usecase, logger);

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  try {
    const result = await createCustomerController.handle(
      JSON.parse(event!.body || '')
    );

    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
