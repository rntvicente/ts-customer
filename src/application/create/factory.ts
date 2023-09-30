import { WinstonLoggerAdapter } from '../../config/logger/winston';

import { CustomerRepositoryAdapter } from '../../application/repository/customer-repository-adapter';

import { CustomerController } from './customer-controller';
import { Create } from './create-usecase';

export const makeCreateController = (database) => {
  const logger = new WinstonLoggerAdapter('Create');
  const repository = new CustomerRepositoryAdapter();

  const usecase = new Create();

  return new CustomerController(usecase, logger);
};
