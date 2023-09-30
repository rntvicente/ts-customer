import { ObjectId } from 'mongodb';

import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

describe('# Unique Entity ID Test Unit', () => {
  it('Deve lançar exceção quando ID inválido', () => {
    jest.spyOn(ObjectId, 'isValid').mockReturnValueOnce(false);
    expect(() => new UniqueEntityIdVO()).toThrow(
      new Error('ID must be a valid ObjectId.')
    );
  });

  it('Deve criar um ObjectId quando não informado param', () => {
    const objectId = new UniqueEntityIdVO();

    expect(ObjectId.isValid(objectId.toString())).toBeTruthy();
  });

  it('Deve aceitar um ObjectId quando informado', () => {
    const value = new ObjectId();
    const result = new UniqueEntityIdVO(value);

    expect(ObjectId.isValid(result.value)).toBeTruthy();
    expect(result.value).toBeInstanceOf(ObjectId);
    expect(result.toString()).toStrictEqual(value.toString());
  });

  it('Deve aceitar um hex quando informado', () => {
    const value = new ObjectId().toString('hex');
    const result = new UniqueEntityIdVO(value);

    expect(ObjectId.isValid(result.value)).toBeTruthy();
    expect(result.value).toBeInstanceOf(ObjectId);
    expect(result.toString()).toStrictEqual(value.toString());
  });
});
