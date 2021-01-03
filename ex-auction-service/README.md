# Serverless Auction Service
Just a basic serverless service usuing various AWS tools

# Setting up
Normal stuff like `npm i` for the repo, but this also assums serverless and AWS-CLI are setup on your machine so that you can deploy via `sls deploy`

# API Information
`POST /auction` - Expects a JSON object with `{ title: STRING }`, Will return all appropriate attributes, of note- the ID field.
`GET /auctions` - No payload, will return all auctions.
`GET /auction/{id}` - No payload, will return bid information for bid with provided id.
`PATCH /auction/{id}/bid` - Expects a body with `{ amount: NUMBER }`. Will return the bid information as per GET auction by id above.

# Structure
Lambda (direct or via API gateway) -> DynamoDB
EventBridge for processAuctions
