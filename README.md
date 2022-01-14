# mow-registry

Backend for the MOW Registry application based on the  mu.semte.ch microservices stack.

This repository is a [mu-project](https://github.com/mu-semtech/mu-project), it includes the minimal set of services required to run the MOW registry.

## Requirements and assumptions
This project was tested on Ubuntu 20.04, but should work on most systems that run docker and docker-compose. A linux based system is recommended, but we welcome any feedback you might have when running this system on macOS or windows.

 * a recent version of [docker needs to be installed](https://docs.docker.com/get-docker/)
 * a recent version of [docker-compose needs to be installed](https://docs.docker.com/compose/install/)
 * some basic shell experience is recommended

## How to

## Getting started
 
 1. make sure all [requirements](#Requirements-and-assumptions) are met
 2. clone this repository
 ```
 $ git clone https://github.com/lblod/app-mow-registry
 ```
 
 3. setup an appropriate login
 ```
 $ docker-compose create
 $ mu script project-scripts generate-login
```
 4. run the project
 ```
 $ cd /path/to/mu-project
 $ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
 ```

You can shut down using `docker-compose stop` and remove everything using `docker-compose rm`.



## Overview of services
[overview of services](https://raw.githubusercontent.com/lblod/app-mow-registry/main/docs/app-mow-registry%20architecture%20diagram.svg)

 * [mu-identifier](https://github.com/mu-semtech/mu-identifier)
 * [mu-dispatcher](https://github.com/mu-semtech/mu-dispatcher)
 * [mu-cl-resources](https://github.com/mu-semtech/mu-cl-resources)
 * [mu-cache](https://github.com/mu-semtech/mu-cache)
 * [mu-authorization](https://github.com/mu-semtech/mu-authorization/)
 * [delta-notifier](https://github.com/mu-semtech/delta-notifier/)
 * [frontend-mow-registry](https://github.com/lblod/frontend-mow-registry)
 * [static-file](https://github.com/mu-semtech/static-file-service)
 * [file](https://github.com/mu-semtech/file-service)
 * [login](https://github.com/mu-semtech/login-service)
