import { FindOptions, ObjectId } from 'mongodb';

import { Customer } from '../../domain/customer-entity';
import { CustomerMap } from '../../shared/mapper/customer-map';
import { DatabaseHelper } from '../database/database-helper';

import CustomerRepository, {
  CustomerFilterType,
  CustomerUpdate,
} from '../../application/repository/customer-repository';
import { CustomerModel } from '../../application/repository/model/customer-model';

const TABLE_NAME = 'customers';

export class CustomerRepositoryAdapter implements CustomerRepository {
  constructor(private readonly database: DatabaseHelper) {}

  async find(filter: CustomerFilterType, options?: FindOptions<Document>): Promise<CustomerModel[] | null> {
    const collection = await this.database.getCollection(TABLE_NAME);
    return collection.find<CustomerModel>(filter, options).toArray();
  }

  async findOneAndUpdate(
    filter: CustomerFilterType,
    data: CustomerUpdate
  ): Promise<number> {
    const collection = await this.database.getCollection(TABLE_NAME);
    const { modifiedCount } = await collection.updateOne(filter, {
      $set: data,
    });

    return modifiedCount;
  }

  async findOne(
    filter: CustomerFilterType,
    options?: FindOptions<Document>
  ): Promise<CustomerModel | null> {
    const collection = await this.database.getCollection(TABLE_NAME);
    return collection.findOne<CustomerModel | null>(filter, options);
  }

  async add(customer: Customer): Promise<void> {
    const model = CustomerMap.toModel(customer);
    const collection = await this.database.getCollection(TABLE_NAME);
    await collection.insertOne(model);
  }

  async remove(customerId: ObjectId): Promise<number> {
    const collection = await this.database.getCollection(TABLE_NAME);
    const { deletedCount } = await collection.deleteOne({ _id: customerId });

    return deletedCount;
  }
}
