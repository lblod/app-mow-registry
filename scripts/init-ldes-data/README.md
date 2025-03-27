# init ldes data

Reset an ldes feed and init it with data from an exsisting given graph

### usage

- mu script project-scripts init-ldes-data "https://dev.roadsigns.lblod.info" # specify the endpoint

### env

```
const INPUT_GRAPH = process.env.INPUT_GRAPH || "http://mu.semte.ch/graphs/mow/registry";
const LDES_FOLDER = process.env.LDES_FOLDER || "ldes-mow-register";
const LDES_FRAGMENTER = process.env.LDES_FRAGMENTER || undefined;
process.env.BASE_URL = process.env.BASE_URL || "https://dev-vlag.roadsigns.lblod.info/";
process.env.FOLDER_DEPTH = process.env.FOLDER_DEPTH || "1";
process.env.PAGE_RESOURCES_COUNT = process.env.PAGE_RESOURCES_COUNT || "50";
process.env.LDES_STREAM_PREFIX = process.env.LDES_STREAM_PREFIX || "http://data.lblod.info/streams/op/";
process.env.TIME_TREE_RELATION_PATH = process.env.TIME_TREE_RELATION_PATH || "http://www.w3.org/ns/prov#generatedAtTime";
process.env.CACHE_SIZE = process.env.CACHE_SIZE || "10";
process.env.DATA_FOLDER = process.env.DATA_FOLDER || "/project/data/ldes-feed";
```
