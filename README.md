# serverless-framework-basic
A repo for playing around with serverless framework- look at mainly ex-auction-service for most details. This is a collection of lambdas and associated serverless components for running an auction service- with auth, bidding, SES notifcations, image upload, etc. 

# Setting up & components
In general, `npm i` + `sls deploy` for each portion unless otherwise specified.
ex-auction-service: Serverless components; this actually houses all the lambdas used for the core auction service and is needed for the other components
notificaitons: A simple part for managing SES notifactions around winning bids, or unsuccessful auctions. 
sls-course-frontend: A simple react frontend that allows for a UI based approach- Optional.
serverless-auth0-authorizer: The auth mechanism for the core service and the UI. Required for sign-up/sign-in
