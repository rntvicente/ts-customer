import { Filter, FindOptions, ObjectId } from 'mongodb';

import { Customer } from '../../domain/customer-entity';

import { AddressModel } from './model/address-model';
import { CustomerModel } from './model/customer-model';

export type CustomerFilterType = Filter<{
  cpf?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: AddressModel;
  createAt?: Date;
  _id?: ObjectId | undefined;
}>;

export default interface CustomerRepository {
  add(customer: Customer): Promise<void>;
  findOne(
    filter: CustomerFilterType,
    options?: FindOptions<Document>
  ): Promise<CustomerModel | null>;
}
