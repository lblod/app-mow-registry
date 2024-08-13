#!/bin/bash
npm i

# we bypass mu auth to avoid producing delta messages that could be consumed by the ldes consumer
MU_SPARQL_ENDPOINT=http://triplestore:8890/sparql node app.mjs
