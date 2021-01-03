import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import validator from '@middy/validator';
import { getAuctionById } from './getAuction';
import placeBidSchema from '../lib/schemas/placeBidSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { email } = event.requestContext.authorizer;
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);

  if (email === auction.seller) {
    throw new createError.Forbidden('You cannot bid on your own auction');
  }

  if (email === auction.highestBid.bidder) {
    throw new createError.Forbidden(
      'You already have have the highest bid for this auction'
    );
  }

  if (auction.status !== 'OPEN') {
    throw new createError.Forbidden(
      `Auction ${auction.title} (${auction.id}) is not OPEN, you cannot place bids on it`
    );
  }

  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Bid must be higher than current highest bid ($${auction.highestBid.amount.toFixed(
        2
      )})`
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email
    },
    ReturnValues: 'ALL_NEW'
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();

    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  };
}

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: placeBidSchema })
);
