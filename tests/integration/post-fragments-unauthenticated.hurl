# tests/integration/post-fragments-unauthenticated.hurl

# Unauthenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
noemail@email.com:nopassword
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 401
HTTP/1.1 401

[Asserts]
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"