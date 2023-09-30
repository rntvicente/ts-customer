import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';

describe('# Unique Entity ID Test Unit', () => {
  it('Deve criar um UUID quando não passado parametro', () => {
    const uuid = new UniqueEntityIdVO();

    expect(uuid).toBeInstanceOf(UniqueEntityIdVO);
    expect(uuid.value).toBeDefined();
  });
});
