import { addData, getConfigFromEnv } from "@lblod/ldes-producer";
import { rm } from 'fs/promises';

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

async function main() {
  const ldesProducerConfig = getConfigFromEnv();
  await deleteDirectory(process.env.DATA_FOLDER);
  const triples = await getGraphTriples();
  await addData(ldesProducerConfig, {
    contentType: "text/turtle",
    folder: LDES_FOLDER,
    body: triples,
    fragmenter: LDES_FRAGMENTER,
  });
}

async function getGraphTriples() {
  const q = `
    CONSTRUCT {?s ?p ?o} WHERE
    {
         GRAPH <${INPUT_GRAPH}>
                     {
                       ?s ?p ?o
                     }

    }`;
  return await fetchNTriples(q);

};

async function deleteDirectory(path) {
  try {
    await rm(path, { recursive: true, force: true });
  } catch (error) {
    console.error(`Error while deleting directory ${path}:`, error);
  }
}
async function fetchNTriples(query) {
  try {
    const response = await fetch(`${process.env.MU_SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=${encodeURIComponent('text/plain')}`, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();
    return data
  } catch (error) {
    console.error('Error:', error);
    process.exit(-1);
  }
}
main().then()
