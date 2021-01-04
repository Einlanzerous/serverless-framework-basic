import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuction(auction) {
  const { id } = auction;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED'
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  };

  await dynamodb.update(params).promise();

  const { title, seller, highestBid } = auction;

  if (highestBid.amount <= 0 || !highestBid.bidder) {
    const notifySeller = sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'Unfortunately, No Bids',
          recipient: seller,
          body: `Unlucky- your "${title}" did not receive any bids for this auction period.`
        })
      })
      .promise();

    await notifySeller;
  } else {
    const { amount, bidder } = highestBid;

    const notifySeller = sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'Item Sold!',
          recipient: seller,
          body: `Sweet- your "${title}" has been sold for $${amount}!`
        })
      })
      .promise();

    const notifyBidder = sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'Auction Won!',
          recipient: bidder,
          body: `Congrats, you had the highest bid on "${title}"! You snagged it for $${amount}!`
        })
      })
      .promise();

    return Promise.all([notifyBidder, notifySeller]);
  }
}
