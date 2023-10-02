import { WinstonLoggerAdapter } from '../../config/logger/winston';
import { DatabaseHelper } from '../../infra/database/database-helper';

import { CustomerRepositoryAdapter } from '../../infra/repository/customer-repository-adapter';

import { DeleteCustomerController } from './delete-customer-controller';
import { Delete } from './delete-usecase';

export const makeDeleteController = (database: DatabaseHelper) => {
  const logger = new WinstonLoggerAdapter('Delete');
  const repository = new CustomerRepositoryAdapter(database);
  const usecase = new Delete(repository, logger);

  return new DeleteCustomerController(usecase, logger);
};
