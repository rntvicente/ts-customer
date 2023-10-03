import { Filter, FindOptions, ObjectId } from 'mongodb';

import { Customer } from '../../domain/customer-entity';

import { AddressModel } from './model/address-model';
import { CustomerModel } from './model/customer-model';

type AddressType = {
  street?: string;
  number?: number;
  neighborhood?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  complement?: string | undefined;
};

export type CustomerFilterType = Filter<{
  cpf?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: AddressType;
  createAt?: Date;
  _id?: ObjectId | undefined;
}>;

export type CustomerUpdate = {
  name?: string;
  phone?: string;
  address?: AddressType;
};

export default interface CustomerRepository {
  add(customer: Customer): Promise<void>;
  remove(customerId: ObjectId): Promise<number>;
  findOneAndUpdate(
    filter: CustomerFilterType,
    data: CustomerUpdate
  ): Promise<number>;
  findOne(
    filter: CustomerFilterType,
    options?: FindOptions<Document>
  ): Promise<CustomerModel | null>;
  find(
    filter: CustomerFilterType,
    options?: FindOptions<Document>
  ): Promise<CustomerModel[] | null>;
}
