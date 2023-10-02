import { WinstonLoggerAdapter } from '../../config/logger/winston';
import { DatabaseHelper } from '../../infra/database/database-helper';

import { CustomerRepositoryAdapter } from '../../infra/repository/customer-repository-adapter';

import { CreateCustomerController } from './create-customer-controller';
import { Create } from './create-usecase';

export const makeCreateController = (database: DatabaseHelper) => {
  const logger = new WinstonLoggerAdapter('Create');
  const repository = new CustomerRepositoryAdapter(database);
  const usecase = new Create(repository, logger);

  return new CreateCustomerController(usecase, logger);
};
