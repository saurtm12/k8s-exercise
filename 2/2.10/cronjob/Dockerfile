# Stage 1: Use Alpine to install curl
FROM alpine:latest as build
RUN apk add --no-cache curl

# Define the command to run curl with the POST request
CMD ["curl", "-X", "POST", "http://todo-backend-svc:2345/todos", "-H", "Content-Type: text/plain", "-d", "Read Book"]