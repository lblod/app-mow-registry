# Images migration (pre 2.0)

This script must run only once, when v2.0 will be deployed.

### how to

- make sure to create a backup of the virtuoso database first! That way, if the script fails, you
  can rollback
- make the script executable: chmod a+x scripts/migrate-images/run.sh
- run: `docker compose up -d triplestore dispatcher identifier db static-file file resource`
- run : `mu script project-scripts migrate-images "https://register.mobiliteit.vlaanderen.be" #(change if it is not prod)`

### env variables

```
const MOW_GRAPH = process.env.MOW_GRAPH || 'http://mu.semte.ch/graphs/mow/registry';
const FILE_PATH = process.env.FILE_PATH || '/data/app/data/files';
const MOW_BASE_URL = process.env.MOW_BASE_URL || 'https://roadsigns.lblod.info'

```
