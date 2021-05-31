# mow-registry

Backend for the MOW Registry application based on the  mu.semte.ch microservices stack.

This repository is a [mu-project](https://github.com/mu-semtech/mu-project), it includes the minimal set of services required to run the MOW registry.

## requirements and assumptions
This project was tested on Ubuntu 20.04, but should work on most systems that run docker and docker-compose. A linux based system is recommended, but we welcome any feedback you might have when running this system on macOS or windows.

 * a recent version of [docker needs to be installed](https://docs.docker.com/get-docker/)
 * a recent version of [docker-compose needs to be installed](https://docs.docker.com/compose/install/)
 * some basic shell experience is recommended

## How to

## Getting started
 
 1. make sure all [requirements](#requirements-and-assumptions) are met
 2. clone this repository
 ```
 $ git clone https://github.com/lblod/app-mow-registry
 ```
 3. run the project
 ```
 $ cd /path/to/mu-project
 $ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
 ```
After running these commands you should have a basic version of embeddable running on port 80.

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


