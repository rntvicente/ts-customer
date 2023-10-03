import Chance from 'chance';

import { AddressVO } from '../../../src/shared/value-object/address.vo';

describe('# Address Test Unit', () => {
  const chance = Chance();

  const invalidValues = ['', ' ', Number('abc'), undefined, null];
  const street = chance.street();
  const number = 10;
  const neighborhood = chance.word({ length: 8 });
  const state = chance.state();
  const city = chance.city();
  const zipcode = '02722000';

  it.each(invalidValues)(
    'Deve lançar exceção quando campo street for inválido - "%s"',
    (value) => {
      expect(
        () =>
          new AddressVO(
            value as never,
            number,
            neighborhood,
            state,
            city,
            zipcode
          )
      ).toThrow(new Error('Missing Param: street.'));
    }
  );

  it.each(invalidValues)(
    'Deve lançar exceção quando informado number inválido - "%s"',
    (value) => {
      expect(
        () =>
          new AddressVO(
            street,
            value as never,
            neighborhood,
            state,
            city,
            zipcode
          )
      ).toThrow(new Error('Invalid Field: number.'));
    }
  );

  it.each(invalidValues)(
    'Deve lançar exceção quando informado neighborhood inválido - "%s"',
    (value) => {
      expect(
        () =>
          new AddressVO(street, number, value as never, state, city, zipcode)
      ).toThrow(new Error('Missing Param: neighborhood.'));
    }
  );

  it.each(invalidValues)(
    'Deve lançar exceção quando informado state inválido - "%s"',
    (value) => {
      expect(
        () =>
          new AddressVO(
            street,
            number,
            neighborhood,
            value as never,
            city,
            zipcode
          )
      ).toThrow(new Error('Missing Param: state.'));
    }
  );

  it.each(invalidValues)(
    'Deve lançar exceção quando informado city inválido - "%s"',
    (value) => {
      expect(
        () =>
          new AddressVO(
            street,
            number,
            neighborhood,
            state,
            value as never,
            zipcode
          )
      ).toThrow(new Error('Missing Param: city.'));
    }
  );

  it.each([...invalidValues, chance.integer({ min: 11111111, max: 99999999 })])(
    'Deve lançar exceção quando informado zipcode inválido - "%s"',
    (value) => {
      expect(
        () =>
          new AddressVO(
            street,
            number,
            neighborhood,
            state,
            city,
            value as never
          )
      ).toThrow(new Error('Invalid Field: zipcode.'));
    }
  );

  it('Deve criar uma instância de Address', () => {
    let address = new AddressVO(
      street,
      number,
      neighborhood,
      state,
      city,
      zipcode
    );

    expect(address).toBeInstanceOf(AddressVO);
    expect(address.street).toStrictEqual(street);
    expect(address.number).toStrictEqual(number);
    expect(address.complement).toBeUndefined();
    expect(address.zipcode).toStrictEqual(zipcode);
    expect(address.neighborhood).toStrictEqual(neighborhood);
    expect(address.state).toStrictEqual(state);
    expect(address.city).toStrictEqual(city);
    expect(address.toString()).toStrictEqual(
      `${street}, ${number}, ${neighborhood} - ${zipcode}, ${state} - ${city}`
    );

    const complement = chance.country();
    address = new AddressVO(
      street,
      number,
      neighborhood,
      state,
      city,
      zipcode,
      complement
    );

    expect(address.toString()).toStrictEqual(
      `${street}, ${number}, ${complement}, ${neighborhood} - ${zipcode}, ${state} - ${city}`
    );
  });
});
