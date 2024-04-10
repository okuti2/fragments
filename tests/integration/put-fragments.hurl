# Testing updating a fragment
POST http://localhost:8080/v1/fragments

Content-Type: text/plain
[BasicAuth]
user1@email.com:password1

```This is a fragment!```

# 1. We expect to get back an HTTP 201(Created)
HTTP/1.1 201

# We have various assertions about the response that we want to check
[Captures]
url: header "Location"

PUT {{url}}

Content-Type: text/plain
[BasicAuth]
user1@email.com:password1

```This is the updated fragment```

# 2. Try to GET the fragment we just posted by its URL
# Capture the value of the url from the body (https://hurl.dev/docs/templates.html)
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This is the updated fragment"


PUT {{url}}

Content-Type: text/html
[BasicAuth]
user1@email.com:password1

```This is the updated fragment```

HTTP/1.1 404