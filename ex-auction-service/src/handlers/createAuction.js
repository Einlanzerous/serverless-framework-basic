async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const currentTime = new Date();

  const auction = {
    title,
    status: 'OPEN',
    createdAt: currentTime.toISOString()
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;


