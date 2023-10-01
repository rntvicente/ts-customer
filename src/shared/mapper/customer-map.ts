import { ObjectId } from 'mongodb';

import { CustomerModel } from '../../application/repository/model/customer-model';
import { Customer as CustomerEntity } from '../../domain/customer-entity';

import { AddressMap } from './address-map';

export class CustomerMap {
  static toModel(customer: CustomerEntity): CustomerModel {
    const addressModel = AddressMap.toModel(customer.address);

    return new CustomerModel(
      customer.cpf.value,
      customer.name,
      customer.email.value,
      customer.phone.toString(),
      addressModel,
      new ObjectId(customer.id.value)
    );
  }
}
