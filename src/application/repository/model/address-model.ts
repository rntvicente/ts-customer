export class AddressModel {
  constructor(
    readonly street: string,
    readonly number: number,
    readonly neighborhood: string,
    readonly state: string,
    readonly city: string,
    readonly zipcode: string,
    readonly complement: string | undefined
  ) {}
}
