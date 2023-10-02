import Joi from 'joi';

const createCustomerSchema = Joi.object()
  .keys({
    cpf: Joi.string()
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      .required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.object()
      .keys({
        street: Joi.string().required(),
        number: Joi.number().integer().required(),
        neighborhood: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        zipcode: Joi.string().required(),
        complement: Joi.string().allow('').optional(),
      })
      .required(),
  })
  .required();

const updateCustomerSchema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    address: Joi.object()
      .keys({
        street: Joi.string().optional(),
        number: Joi.number().integer().optional(),
        neighborhood: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
        zipcode: Joi.string().optional(),
        complement: Joi.string().optional(),
      })
      .optional(),
  })
  .required();

export const validateCreateSchema = (body) =>
  createCustomerSchema.validate(body);

export const validateUpdateSchema = (body) =>
  updateCustomerSchema.validate(body);
