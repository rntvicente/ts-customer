import { ObjectId } from 'mongodb';

import { CustomerModel } from '../../application/repository/model/customer-model';
import { Customer as CustomerEntity } from '../../domain/customer-entity';

import { UniqueEntityIdVO } from '../value-object/unique-entity-id.vo';
import { CpfVO } from '../value-object/cpf.vo';
import { EmailVO } from '../value-object/email.vo';
import { PhoneNumberVO } from '../value-object/phone-number.vo';

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
      customer.createAt,
      new ObjectId(customer.id.value)
    );
  }

  static toEntity(model: CustomerModel): CustomerEntity {
    const addressVO = AddressMap.toEntity(model.address);

    return new CustomerEntity(
      new UniqueEntityIdVO(model._id),
      new CpfVO(model.cpf),
      model.name,
      new EmailVO(model.email),
      new PhoneNumberVO(model.phone),
      addressVO,
      model.createAt
    );
  }
}
