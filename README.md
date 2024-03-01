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
  node src/index.js

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

  curl -H "Authorization: Bearer {id_token}" http://localhost:8080/v1/fragments 

  curl -i : includes http response header in the output

  curl -X : specifies custom request for POST, PUT or DELETE

  curl -u : passing user credentials in the format username:password
  
  curl -d : used to send data in a POST request curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:8080

- Run the unit tests
  npm run test

- Check the coverage for the tests 
  npm run coverage

curl.exe -i -u toyosikuti@gmail.com:T0y0s1Kut1@1012 http://localhost:8080/v1/fragments

curl -i -u email:password http://localhost:8080/v1/fragments/{fragment_id}

curl.exe -i -X POST -u toyosikuti@gmail.com:T0y0s1Kut1@1012 -H "Content-Type: text/html" -d "This is a fragment" http://localhost:8080/v1/fragments

curl -i -H "Authorization: Bearer {id_token}" http://localhost:8080/v1/fragments/{fragment_id}

- Running DockerFiles

- To build the image to a container
docker build -t okuti/fragments:latest .

- To run on docker and access on browser
docker run --rm --name fragments --env-file .env -p 8080:8080 fragments:latest

- How to run a detached container 
docker run --rm --name fragments --env-file .env -p 8080:8080 -d fragments:latest

- To check the logs from a detached logs (-f to follow)
docker logs -f <dockerid>

- Pushing images into DockerHub