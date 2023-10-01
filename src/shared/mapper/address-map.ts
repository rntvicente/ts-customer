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

  static toEntity(model: AddressModel): AddressVO {
    return new AddressVO(
      model.street,
      model.number,
      model.neighborhood,
      model.state,
      model.city,
      model.zipcode,
      model.complement
    );
  }
}
