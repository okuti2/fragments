# 404 test
GET http://localhost:8080/this/route/does/not/exist

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "error.message": "not found" }
jsonpath "$.error.message" == "not found"
# We expect to get back a JSON response with { ..., "error.code": "404" }
jsonpath "$.error.code" == 404