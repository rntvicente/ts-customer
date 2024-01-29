/* eslint-disable @typescript-eslint/no-shadow */
import { CloudWatchLogger } from '../config/logger/cloud-watch-logger';
import { Create } from '../application/create/create-usecase';
import { CreateCustomerController } from '../application/create/create-customer-controller';
import { AwsAdapter } from '../infra/queue/aws-adapter';
import { DynamodbCustomerAdapter } from '../infra/repository/customer-dynamodb-adapter';
import { SendEmailCostumerCreatedEvent } from '../application/event/send-email-costumer-created-event';

const logger = new CloudWatchLogger('customer-api', '[CUSTOMER-CREATED]');
const sns = new AwsAdapter(logger);
const event = new SendEmailCostumerCreatedEvent(sns, logger);
const repository = new DynamodbCustomerAdapter();
const usecase = new Create(event, repository, logger);

const createCustomerController = new CreateCustomerController(usecase, logger);

export const handler = async (event) => {
  try {
    const request = {
      body: JSON.parse(event.body),
    } as any;

    const result = await createCustomerController.handler(request);

    return {
      statusCode: result.statusCode,
      body: JSON.stringify(result.body),
    };
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));

    return {
      statusCode: 422,
      body: JSON.stringify({ error: JSON.stringify(error) }),
    };
  }
};
