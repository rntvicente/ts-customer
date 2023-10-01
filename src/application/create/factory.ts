import { WinstonLoggerAdapter } from '../../config/logger/winston';
import { DatabaseHelper } from '../../infra/database/database-helper';

import { CustomerRepositoryAdapter } from '../../application/repository/customer-repository-adapter';

import { CustomerController } from './customer-controller';
import { Create } from './create-usecase';

export const makeCreateController = (database: DatabaseHelper) => {
  const logger = new WinstonLoggerAdapter('Create');
  const repository = new CustomerRepositoryAdapter(database);
  const usecase = new Create(repository, logger);

  return new CustomerController(usecase, logger);
};
