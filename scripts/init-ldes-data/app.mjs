import { addData, getConfigFromEnv } from "@lblod/ldes-producer";
import { rm } from "fs/promises";
import * as fs from "node:fs";
import { sparqlEscapeUri } from "./utils.mjs";
const INPUT_GRAPH = "http://mu.semte.ch/graphs/mow/registry";
const LDES_FOLDER = "ldes-mow-register";
const LDES_FRAGMENTER = undefined;

const RESOURCE_TYPES = JSON.parse(
  fs.readFileSync(
    "/project/config/ldes-delta-pusher/resource_types.json",
    "utf8"
  )
);

process.env.FOLDER_DEPTH = "1";
process.env.PAGE_RESOURCES_COUNT = "50";
process.env.LDES_STREAM_PREFIX = "http://data.lblod.info/streams/op/";
process.env.TIME_TREE_RELATION_PATH =
  "http://www.w3.org/ns/prov#generatedAtTime";
process.env.CACHE_SIZE = "10";
process.env.DATA_FOLDER = "/project/data/ldes-feed";

if (!process.env.BASE_URL) {
  console.error("missing argument BASE_URL");
  process.exit(-1);
}

if (process.env.BASE_URL.endsWith("/")) {
  console.error("base url should not end with a trailing slash");
  process.exit(-1);
}
export async function waitForDatabase() {
  while (true) {
    try {
      const response = await fetch(
        `${process.env.MU_SPARQL_ENDPOINT}?query=${encodeURIComponent(
          "ASK { ?s ?p ?o }"
        )}&format=${encodeURIComponent("text/plain")}`,
        {
          method: "post",
          headers: {
            Accept: "text/plain",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`http error! status: ${response.status}`);
      }
      break;
    } catch (e) {
      console.log("wait for database...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
async function main() {
  await waitForDatabase();
  const ldesProducerConfig = getConfigFromEnv();
  await deleteDirectory(process.env.DATA_FOLDER);
  const count = await getTotalCount();
  const limit = 10000;
  const totalPages = calculatePages(count, limit);
  console.log("count:", count, "total pages:", totalPages);
  let triples = "";
  for (let page = 1; page <= totalPages; page++) {
    triples += await getGraphTriples(page, limit);
  }
  if (triples.length) {
    await addData(ldesProducerConfig, {
      contentType: "text/turtle",
      folder: LDES_FOLDER,
      body: triples,
      fragmenter: LDES_FRAGMENTER,
    });
  }
}
function calculatePages(totalCount, limit) {
  return Math.ceil(totalCount / limit);
}
async function getTotalCount() {
  const countQuery = `
    PREFIX mobiliteit: <https://data.vlaanderen.be/ns/mobiliteit#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX lblodmow: <http://data.lblod.info/vocabularies/mobiliteit/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX tribont: <https://w3id.org/tribont/core#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX as: <https://www.w3.org/ns/activitystreams#>
    PREFIX variables: <http://lblod.data.gift/vocabularies/variables/>

    SELECT (COUNT(distinct *) AS ?count)
    WHERE {
      GRAPH <${INPUT_GRAPH}>{
        ?s ?p ?o.
        FILTER EXISTS {
          ?s a ?type.
          FILTER (?type IN (
            ${RESOURCE_TYPES.map((type) => sparqlEscapeUri(type)).join(",\n")}
          )) 
        }
      }
    }
  `;

  const response = await fetch(
    `${process.env.MU_SPARQL_ENDPOINT}?query=${encodeURIComponent(countQuery)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/sparql-results+json",
      },
    }
  );

  const result = await response.json();
  const count = parseInt(result.results.bindings[0].count.value, 10);
  return count;
}
async function getGraphTriples(page, limit) {
  const offset = (page - 1) * limit;
  const q = `
    PREFIX mobiliteit: <https://data.vlaanderen.be/ns/mobiliteit#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX lblodmow: <http://data.lblod.info/vocabularies/mobiliteit/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX tribont: <https://w3id.org/tribont/core#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX variables: <http://lblod.data.gift/vocabularies/variables/>
    PREFIX qudt: <http://qudt.org/schema/qudt/>
    CONSTRUCT {?s ?p ?o} WHERE
    {
      SELECT distinct ?s ?p ?o WHERE {

         GRAPH <${INPUT_GRAPH}>
               {
                    ?s a ?type; ?p ?o.
                    filter (?type in (
                        ${RESOURCE_TYPES.map((type) =>
                          sparqlEscapeUri(type)
                        ).join(",\n")}
                  ))
               }
      } ORDER BY ?s ?p ?o

    }
    
    LIMIT ${limit}
    OFFSET ${offset}

`;
  console.log(q);

  return await fetchNTriples(q);
}

async function deleteDirectory(path) {
  try {
    await rm(path, { recursive: true, force: true });
  } catch (error) {
    console.error(`Error while deleting directory ${path}:`, error);
  }
}
async function fetchNTriples(query) {
  try {
    const response = await fetch(
      `${process.env.MU_SPARQL_ENDPOINT}?query=${encodeURIComponent(
        query
      )}&format=${encodeURIComponent("text/plain")}`,
      {
        method: "post",
        headers: {
          Accept: "text/plain",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`http error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error:", error);
    process.exit(-1);
  }
}
main().then();
