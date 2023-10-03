import { EmailVO } from '../../../src/shared/value-object/email.vo';

describe('# E-mail Test Unit', () => {
  const invalidValues = [
    '',
    ' ',
    '11',
    '5137839532',
    '5137839532123465798',
    'invalid_phonenumber',
    'joe.doe',
    'joe.doe@',
    'joe.doe@email',
    'joe.doe@email.',
    'joe.doe@email.com.',
    undefined,
    null,
    true,
    false,
    51937839532,
    {},
    [],
    Number('abc'),
    Promise.resolve(''),
    () => {},
    new Error(),
  ];

  it.each(invalidValues)(
    'Deve lançar exceção quando email inválido "%s"',
    (value) => {
      expect(() => new EmailVO(value as never)).toThrow(
        'Invalid Field: e-mail.'
      );
    }
  );

  it('Deve retornar uma instância de email quando validação for aceita', () => {
    const validEmail = 'joe.doe@email.com';

    const email = new EmailVO(validEmail);

    expect(email.value).toStrictEqual(validEmail);
  });
});
