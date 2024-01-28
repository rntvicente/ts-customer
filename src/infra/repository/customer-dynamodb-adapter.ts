/* eslint-disable @typescript-eslint/no-unused-vars */
import CustomerRepository, {
  CustomerFilterType,
  CustomerUpdate,
} from '../../application/repository/customer-repository';
import { DynamodbBaseRepository } from '../../infra/database/dynamodb-helper';

import { Customer } from '../../domain/customer-entity';

import { CustomerMap } from '../../shared/mapper/customer-map';
import { CustomerModel } from 'application/repository/model/customer-model';
import { ObjectId, FindOptions } from 'mongodb';

export const CustumerKeys = {
  PK: 'CUSTOMER',
  SK: 'CUSTUMER',
};

export class DynamodbCustomerAdapter
  extends DynamodbBaseRepository
  implements CustomerRepository
{
  remove(customerId: ObjectId): Promise<number> {
    throw new Error('Method not implemented.');
  }

  findOneAndUpdate(
    filter: CustomerFilterType,
    data: CustomerUpdate
  ): Promise<number> {
    throw new Error('Method not implemented.');
  }

  findOne(
    filter: CustomerFilterType,
    options?: FindOptions<Document> | undefined
  ): Promise<CustomerModel | null> {
    throw new Error('Method not implemented.');
  }

  find(
    filter: CustomerFilterType,
    options?: FindOptions<Document> | undefined
  ): Promise<CustomerModel[] | null> {
    throw new Error('Method not implemented.');
  }

  async add(customer: Customer): Promise<void> {
    const model = CustomerMap.toModel(customer);

    const params = {
      TableName: this.tableName,
      Item: {
        PK: `${CustumerKeys.PK}#${model._id}`,
        SK: `${CustumerKeys.SK}#${model._id}`,
        ...model,
      },
    };

    await this.putItem(params);
  }
}
