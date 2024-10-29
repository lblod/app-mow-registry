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
  const count = await getTotalCount();
  const limit = 10000;
  const totalPages = calculatePages(count, limit);
  console.log("count:", count, "total pages:", totalPages)
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
    SELECT (COUNT(distinct *) AS ?count)
    WHERE {
      GRAPH <${INPUT_GRAPH}>{
        ?s ?p ?o.
        FILTER EXISTS {
          ?s a ?type.
          FILTER (?type IN (
            cidoc:E54_Dimension,
            ext:ShapeClassificatieCode,
            foaf:Document,
            ext:Concept,
            foaf:Image,
            lblodmow:Codelist,
            lblodmow:VerkeersbordconceptStatusCode,
            mobiliteit:Mobiliteitmaatregelconcept,
            mobiliteit:Pictogram,
            mobiliteit:Template,
            as:Tombstone,
            mobiliteit:Variabele,
            mobiliteit:Verkeersbordcategorie,
            mobiliteit:Verkeersbordconcept,
            mobiliteit:VerkeersbordconceptStatus,
            mobiliteit:Verkeerslichtconcept,
            mobiliteit:Verkeerstekenconcept,
            mobiliteit:Wegmarkeringconcept,
            rdfs:Resource,
            skos:Concept,
            skos:ConceptScheme,
            tribont:Shape
          )) 
        }
      }
    }
  `;

  const response = await fetch(`${process.env.MU_SPARQL_ENDPOINT}?query=${encodeURIComponent(countQuery)}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  });

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

    CONSTRUCT {?s ?p ?o} WHERE
    {
      SELECT distinct ?s ?p ?o WHERE {

         GRAPH <${INPUT_GRAPH}>
               {
                    ?s a ?type; ?p ?o.
                    filter (?type in (
                        cidoc:E54_Dimension,
                        ext:ShapeClassificatieCode,
                        foaf:Document,
                        ext:Concept,
                        foaf:Image,
                        lblodmow:Codelist,
                        lblodmow:VerkeersbordconceptStatusCode,
                        mobiliteit:Mobiliteitmaatregelconcept,
                        mobiliteit:Pictogram,
                        mobiliteit:Template,
                        mobiliteit:Variabele,
                        mobiliteit:Verkeersbordcategorie,
                        mobiliteit:Verkeersbordconcept,
                        mobiliteit:VerkeersbordconceptStatus,
                        mobiliteit:Verkeerslichtconcept,
                        mobiliteit:Verkeerstekenconcept,
                        mobiliteit:Wegmarkeringconcept,
                        rdfs:Resource,
                        skos:Concept,
                        skos:ConceptScheme,
                        tribont:Shape
                  ))
               }
      } ORDER BY ?s ?p ?o

    }
    
    LIMIT ${limit}
    OFFSET ${offset}

`;
  console.log(q);

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

    return await response.text();
  } catch (error) {
    console.error('Error:', error);
    process.exit(-1);
  }
}
main().then()
