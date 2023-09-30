import { Customer } from '../../domain/customer-entity';

export default interface CustomerRepository {
  add(customer: Customer): Promise<string>;
}
