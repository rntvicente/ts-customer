const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey'
});

const dynamodb = new AWS.DynamoDB();
const tableName = 'customers';

const params = {
  AttributeDefinitions: [
    { AttributeName: 'CUSTOMER', AttributeType: 'S' },
    { AttributeName: 'CPF', AttributeType: 'S' },
    { AttributeName: 'EMAIL', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'CUSTOMER', KeyType: 'HASH' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: tableName,
  GlobalSecondaryIndexes: [
    {
      IndexName: 'CPFIndex',
      KeySchema: [
        { AttributeName: 'CPF', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    },
    {
      IndexName: 'EMAILIndex',
      KeySchema: [
        { AttributeName: 'EMAIL', KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }
  ]
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error('Erro ao criar os índices GSI:', err);
  } else {
    console.log('Índices GSI criados com sucesso:', data);
  }
});
