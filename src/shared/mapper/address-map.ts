import { AddressModel } from '../../application/repository/model/address-model';
import { AddressVO } from '../value-object/address.vo';

export class AddressMap {
  static toModel(address: AddressVO): AddressModel {
    return new AddressModel(
      address.street,
      address.number,
      address.neighborhood,
      address.state,
      address.city,
      address.zipcode,
      address.complement
    );
  }
}
