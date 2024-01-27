import { APIGatewayEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: process.env.DYNAMODB_CUSTOMERS,
        input: event,
      },
      null,
      2
    ),
  };
};
