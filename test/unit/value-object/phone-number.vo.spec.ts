import { PhoneNumberVO } from '../../../src/shared/value-object/phone-number.vo';

describe('# PhoneNumber Test Units', () => {
  const invalidValues = [
    ' ',
    '',
    '11',
    '5137839532',
    '(11) 82247878',
    '5137839532123465798',
    'invalid_phonenumber',
  ];

  it.each(invalidValues)(
    'Deve lançar exceção quando número for inválido "%s"',
    (value) => {
      const validatePhoneSpy = jest.spyOn(
        PhoneNumberVO.prototype as never,
        'validate'
      );

      expect(() => new PhoneNumberVO(value as never)).toThrow(
        'Invalid Field: phone number.'
      );
      expect(validatePhoneSpy).toBeCalled();
    }
  );

  it('Deve retornar uma instância de PhoneNumber quando validações forem aceitas', () => {
    const validPhonenumber = '51937839532';
    const validatePhoneSpy = jest.spyOn(
      PhoneNumberVO.prototype as never,
      'validate'
    );

    const phone = new PhoneNumberVO(validPhonenumber);

    expect(validatePhoneSpy).toBeCalled();
    expect(phone.value).toStrictEqual(validPhonenumber);
    expect(phone.toString()).toStrictEqual('(51) 93783-9532');
  });
});
