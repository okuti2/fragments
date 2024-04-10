# GET request to convert fragment data
POST http://localhost:8080/v1/fragments

# We're sending a plain text fragment
Content-Type: text/html
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
```<p>This is a fragment!</p>```

# 1. We expect to get back an HTTP 201(Created)
HTTP/1.1 201

# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# convert the fragment to txt
# 2. Try to GET the fragment we just posted by its URL
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
# https://github.com/expressjs/express/issues/3490
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This is a fragment!"


# CONVERTING IMAGES INTO IMAGE

POST http://localhost:8080/v1/fragments

Content-Type: image/png
[BasicAuth]
user1@email.com:password1

file,Sample-PNG-Image.png;

# 1. We expect to get back an HTTP 201(Created)
HTTP/1.1 201

[Captures]
url: header "Location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}.webp
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: image/webp

