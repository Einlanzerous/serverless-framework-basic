# Serverless Auction Service
Just a basic serverless service usuing various AWS tools

# Setting up
Normal stuff like `npm i` for the repo, but this also assums serverless and AWS-CLI are setup on your machine so that you can deploy via `sls deploy`

# API Information
`POST /auction` - Expects a JSON object with `{ title: STRING }`, will return all appropriate attributes, of note- the ID field.


# Structure
Lambda -> DynamoDB
