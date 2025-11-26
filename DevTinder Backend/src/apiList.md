# DevTinder APIs

## Auth Router
- POST     /signup
- POST     /login
- POST     /logout


## Profile Router
- GET      /profile/view
- PATCH    /profile/edit
- PATCH    /profile/password


## Connection Request Router
  Send a request to someone
- POST     /request/send/interested/:userId
- POST     /request/send/ignored/:userId

  Review the incoming request
- POST     /request/review/accepted/:requestId
- POST     /request/review/rejected/:requestId


## User Router
- GET      /user/connections          - Gets the information/list of those people who had accepted my connection request
- GET      /user/requests/recieved    - Gets all the "pending requests" of a loggedInUser
- GET      /user/feed                 - Gets all the profile of other users at a time


Connection Request Status: ignored, interested, accepted, rejected
                            LEFT      RIGHT
                            SWIPE     SWIPE





### Send a request to someone
- POST     /request/send/interested/:userId
  Check1: while sending a connection request, the user should either be interested or ignored
  Check2: while sending a connection request, the toUserId should exist in the DB
  Check3: while sending a connection request, if toUserId exists then, the connection request for the same toUserID should not exist 
  Check4: a user cannot send connection request to themself, for that we have made a schema method which will run just before an instance of "ConnectionRequest" Collection is being saved, this schema method will check if fromUserID is same as toUserId 





### Reviewing a request
- POST     /request/send/accepted/:requestId
  Check 1: Validate the status
  Check 2: Validate that the loggedInUser should be the user to whom the request has been sent so that he can accept or reject it
  Check 3: Validate that the person who sent the request to the loggedInUser was "interested"
  Check 4: Also check for the requestId of the incoming request i.e., the request which the loggedInUser is reviewing should exist also




### Pagination
|------------------Human Readable Form--------------||-----MongoDb Format--------|
/feed?page=2&limit=10  --> first ten users 1-10    --> .skip(0)    &   .limit(10) 

/feed?page=2&limit=10  --> next ten users  11-20   --> .skip(10)   &   .limit(10)

/feed?page=3&limit=10  --> next ten users  21-30   --> .skip(20)   &   .limit(10)

skip = (page -1) * limit
 
.skip()  --> how many elements to skip from starting

.limit() --> how many elements to show
