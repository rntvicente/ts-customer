import Chance from 'chance';

import { AddressMap } from '../../../src/shared/mapper/address-map';
import { AddressVO } from '../../../src/shared/value-object/address.vo';
import { AddressModel } from '../../../src/application/repository/model/address-model';

describe('# Test Unit Map Address', () => {
  const chance = Chance();

  it('Deve retoanr ium instânica de AddressModel', () => {
    const addressMock = new AddressVO(
      chance.street(),
      10,
      chance.animal(),
      chance.state(),
      chance.city(),
      '02722000',
      chance.word({ length: 35 })
    );

    const input = new AddressVO(
      addressMock.street,
      addressMock.number,
      addressMock.neighborhood,
      addressMock.state,
      addressMock.city,
      addressMock.zipcode,
      addressMock.complement
    );

    const model = AddressMap.toModel(input);

    expect(model).toBeInstanceOf(AddressModel);
  });
});
