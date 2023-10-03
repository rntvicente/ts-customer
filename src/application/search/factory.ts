import { WinstonLoggerAdapter } from '../../config/logger/winston';
import { DatabaseHelper } from '../../infra/database/database-helper';

import { CustomerRepositoryAdapter } from '../../infra/repository/customer-repository-adapter';

import { SearchCustomerController } from './search-customer-controller';
import { Search } from './search-usecase';

export const makeSearchController = (database: DatabaseHelper) => {
  const logger = new WinstonLoggerAdapter('Delete');
  const repository = new CustomerRepositoryAdapter(database);
  const usecase = new Search(repository, logger);

  return new SearchCustomerController(usecase, logger);
};
