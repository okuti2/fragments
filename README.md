# fragments

node.js based REST API using express

use git status to check the status of file changes

- run the eslint
  npm run lint

- run curl
  curl.exe http://localhost:8080
  curl.exe -s localhost:8080 | jq
  To check the dev tools curl.exe -i localhost:8080

- start the server
  node src/server.js

- start
  npm run start
- run dev
  npm run dev
- run debug
  npm run debug or F5
  then curl.exe -s localhost:8080 to see the breakpoint get hit

- Commands with curl to remember 
  To log in using the id_token on the terminal
  curl -H : used to include extra HTTP headers in request 
  curl.exe -H "Authorization: Bearer {token_id here}" http:localhost:8080/v1/fragments 
  curl -i : includes http response header in the output
  curl -X : specifies custom request for POST, PUT or DELETE
  curl -u : passing user credentials in the format username:password
  curl -d : used to send data in a POST request curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:8080