# mow-registry

Backend for the MOW Registry application based on the  mu.semte.ch microservices stack.

## How to

### Boot up the system in DEV environment

    cd /path/to/mu-project
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

You can shut down using `docker-compose stop` and remove everything using `docker-compose rm`.

### File service

- Download/Fetch a file uploaded from the service:
  
    `GET` http://localhost/files/:id/download

- Upload a file using the upload service:
  
    `POST` http://localhost/files/ `Accept: multipart/form-data`

  *Note: you need to use 'file' as a Key to pass your file inside your FormData object*

- Delete a file:

    `DELETE` http://localhost/files/:id

- Get file metadata (JSONApi /ember data):
  
    `GET` http://localhost/files/:id
  
- Get all files metadata (JSONApi /ember data):
  
    `GET` http://localhost/files/


