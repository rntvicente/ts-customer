import Chance from 'chance';

import { CpfVO } from '../../../src/shared/value-object/cpf.vo';

describe('# Cpf Test Unit', () => {
  const chance = Chance();
  const invalidCpf = [
    '406.302.170-27',
    '406302170',
    '406302170123456789',
    '406302170123456789',
  ];

  it.each(invalidCpf)(
    'Deve lançar exceção quando informado CPF inválido - "%s"',
    function (value) {
      expect(() => new CpfVO(value)).toThrow(new Error('Invalid Field: cpf.'));
    }
  );

  it.each(['111.111.111-11', '222.222.222-22'])(
    'Deve lançar exceção quando CPF ter mesmos números repetidamente - "%s"',
    function (value) {
      expect(() => new CpfVO(value)).toThrow(new Error('Invalid Field: cpf.'));
    }
  );

  it('deve retornar uma instância de CPF sem caracter especial', function () {
    const value = chance.cpf({ formatted: true });
    const cpf = new CpfVO(value);

    expect(cpf.value).toStrictEqual(value.replace(/\D/g, ''));
    expect(cpf).toBeInstanceOf(CpfVO);
    expect(cpf.toString()).toStrictEqual(value);
  });
});
