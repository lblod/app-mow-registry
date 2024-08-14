#!/bin/bash
mkdir -p /data/app/data/files
npm i
# we bypass mu auth to be able to get the result of our construct query in n-triples format
MU_SPARQL_ENDPOINT=http://triplestore:8890/sparql node app.mjs
