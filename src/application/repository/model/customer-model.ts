import { ObjectId } from 'mongodb';

import { AddressModel } from './address-model';

export class CustomerModel {
  constructor(
    readonly cpf: string,
    readonly name: string,
    readonly email: string,
    readonly phone: string,
    readonly address: AddressModel,
    readonly _id: ObjectId | undefined
  ) {}
}
