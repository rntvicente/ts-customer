import { FindOptions } from 'mongodb';
import CustomerRepository, {
  CustomerFilterType,
} from '../../../src/application/repository/customer-repository';
import { CustomerModel } from '../../../src/application/repository/model/customer-model';
import { UniqueEntityIdVO } from '../../../src/shared/value-object/unique-entity-id.vo';
import { Customer } from '../../../src/domain/customer-entity';

export const makeRepository = (input) => {
  class CustomerRepositoryStub implements CustomerRepository {
    remove(): Promise<number> {
      throw new Error('Method not implemented.');
    }

    findOneAndUpdate(): Promise<number> {
      throw new Error('Method not implemented.');
    }

    find(): Promise<CustomerModel[] | null> {
      throw new Error('Method not implemented.');
    }

    findOne(
      filter: CustomerFilterType,
      options?: FindOptions<Document> | undefined
    ): Promise<CustomerModel | null> {
      expect(options).not.toBeDefined();
      const [itemOne, ItemTwo] = filter!.$or;

      if (
        itemOne.cpf === '04153984019' ||
        ItemTwo.email === 'joe.doe@repet.com'
      ) {
        const id = new UniqueEntityIdVO();
        return Promise.resolve({ ...input, _id: id.value });
      }

      return Promise.resolve(null);
    }

    async add(customer: Customer): Promise<void> {
      expect(customer.id).toBeDefined();
    }
  }

  return new CustomerRepositoryStub();
};
