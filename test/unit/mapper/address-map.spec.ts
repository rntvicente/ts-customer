import Chance from 'chance';

import { AddressMap } from '../../../src/shared/mapper/address-map';
import { AddressVO } from '../../../src/shared/value-object/address.vo';
import { AddressModel } from '../../../src/application/repository/model/address-model';

describe('# Test Unit Map Address', () => {
  const chance = Chance();

  it('Deve retornar uma instância de AddressModel', () => {
    const entity = new AddressVO(
      chance.street(),
      10,
      chance.animal(),
      chance.state(),
      chance.city(),
      '02722000',
      chance.word({ length: 35 })
    );

    const model = AddressMap.toModel(entity);
    expect(model).toBeInstanceOf(AddressModel);
  });

  it('Deve retornar uma instância de Address Entity', () => {
    const model = new AddressModel(
      chance.street(),
      100,
      chance.animal(),
      chance.state(),
      chance.city(),
      '02722-000',
      chance.word({ length: 35 })
    );

    const entity = AddressMap.toEntity(model);
    expect(entity).toBeInstanceOf(AddressVO);
  });
});
