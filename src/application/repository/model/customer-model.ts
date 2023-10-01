import { ObjectId } from 'mongodb';

import { AddressModel } from './address-model';

export class CustomerModel {
  constructor(
    readonly cpf: string,
    readonly name: string,
    readonly email: string,
    readonly phone: string,
    readonly address: AddressModel,
    readonly createAt: Date,
    readonly _id: ObjectId | undefined
  ) {}
}
