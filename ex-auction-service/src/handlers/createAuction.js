import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import createAuctionSchema from '../lib/schemas/createAuctionSchema';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const currentTime = new Date();
  const endDate = new Date();
  endDate.setHours(currentTime.getHours() + 1);

  const auction = {
    title,
    id: uuid(),
    status: 'OPEN',
    createdAt: currentTime.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0
    }
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction)
  };
}

export const handler = commonMiddleware(createAuction).use(validator({ inputSchema: createAuctionSchema }));
