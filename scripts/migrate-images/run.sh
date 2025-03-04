#!/bin/bash
mkdir -p /data/app/data/files
npm i
# we bypass mu auth to avoid producing delta messages that could be consumed by the ldes consumer
#       MOW_BASE_URL: "https://register.mobiliteit.vlaanderen.be" # override this on every environment, prod by default
export MOW_BASE_URL=$1
node app.mjs
