# GET request to fetch fragments for the current user
GET http://localhost:8080/v1/fragments

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
# Response assertions
[Asserts]
jsonpath "$.fragments" != null