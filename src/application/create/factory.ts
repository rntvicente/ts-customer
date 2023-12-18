import { SendEmailCostumerCreatedEvent } from '../event/send-email-costumer-created-event';
import { WinstonLoggerAdapter } from '../../config/logger/winston';
import { DatabaseHelper } from '../../infra/database/database-helper';

import { CustomerRepositoryAdapter } from '../../infra/repository/customer-repository-adapter';

import { CreateCustomerController } from './create-customer-controller';
import { Create } from './create-usecase';
import { Queue } from '../../infra/queue';

export const makeCreateController = (
  database: DatabaseHelper,
  queue: Queue
) => {
  const logger = new WinstonLoggerAdapter('Create');
  const repository = new CustomerRepositoryAdapter(database);
  const event = new SendEmailCostumerCreatedEvent(queue, logger);
  const usecase = new Create(event, repository, logger);

  return new CreateCustomerController(usecase, logger);
};
