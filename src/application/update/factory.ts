import { WinstonLoggerAdapter } from '../../config/logger/winston';
import { DatabaseHelper } from '../../infra/database/database-helper';

import { CustomerRepositoryAdapter } from '../../infra/repository/customer-repository-adapter';

import { UpdateCustomerController } from './update-customer-controller';
import { Update } from './update-usecase';

export const makeUpdateController = (database: DatabaseHelper) => {
  const logger = new WinstonLoggerAdapter('Update');
  const repository = new CustomerRepositoryAdapter(database);
  const usecase = new Update(repository, logger);

  return new UpdateCustomerController(usecase, logger);
};
