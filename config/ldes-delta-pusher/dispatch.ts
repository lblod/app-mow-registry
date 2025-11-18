import { moveTriples } from "../support";
import { Changeset, Quad } from "./types";
import { querySudo } from "@lblod/mu-auth-sudo";
import { sparqlEscapeUri } from "mu";
import { enrichWithDownloadURLs } from "./add-download-url";
const MOW_REGISTRY_BASE_URL = process.env.LDES_BASE;

if (!MOW_REGISTRY_BASE_URL) {
  throw "missing MOW_REGISTRY_BASE_URL";
}

console.log(MOW_REGISTRY_BASE_URL);
export default async function dispatch(changesets: Changeset[]) {
  const filteredChangesets = filterOutIrrelevantChanges(changesets);
  const subjects = mapToSubjects(filteredChangesets);
  if(!subjects.length){
    return;
  }
  console.log("dispatching...");
  await enrichWithDownloadURLs(subjects, MOW_REGISTRY_BASE_URL as string);
  for (const subject of subjects) {
    const {
      results: { bindings },
    } = await querySudo(/* sparql */ `
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
        PREFIX qudt: <http://qudt.org/schema/qudt/>

        CONSTRUCT {
            ?s ?p ?o
        } WHERE {
            GRAPH <http://mu.semte.ch/graphs/mow/registry> {
              ?s 
                a ?type; 
                ?p ?o.
            }
            VALUES ?s {${sparqlEscapeUri(subject)} }
            FILTER (?type IN (
                cidoc:E54_Dimension,
                ext:ShapeClassificatieCode,
                foaf:Document,
                ext:Concept,
                foaf:Image,
                as:Tombstone,
                lblodmow:Codelist,
                lblodmow:VerkeersbordconceptStatusCode,
                mobiliteit:Mobiliteitmaatregelconcept,
                mobiliteit:Pictogram,
                mobiliteit:Template,
                variables:Variable,
                mobiliteit:Verkeersbordcategorie,
                mobiliteit:Verkeersbordconcept,
                mobiliteit:VerkeersbordconceptStatus,
                mobiliteit:Verkeerslichtconcept,
                mobiliteit:Verkeerstekenconcept,
                mobiliteit:Wegmarkeringconcept,
                rdfs:Resource,
                skos:Concept,
                skos:ConceptScheme,
                tribont:Shape,
                qudt:Unit,
                qudt:QuantityKind
          ))
        }
        `);
    if (bindings.length) {
      console.log("SUCCESS");
      try {
        await moveTriples([
          {
            inserts: bindings.map(({ s, p, o }) => {
              return { subject: s, predicate: p, object: o };
            }),
          },
        ]);
      } catch (e) {
        console.log("FAILURE");
        console.log("==================================================");
        console.log(e);
        console.log({
          inserts: bindings.map(({ s, p, o }) => {
            return { subject: s, predicate: p, object: o };
          }),
        });
        console.log("==================================================");
      }
    }
  }
}

function filterOutIrrelevantChanges(changesets: Changeset[]): Changeset[] {
  return changesets.map((changeset) => {
    const filterFn = (quad: Quad) =>
      quad.predicate.value !== "http://purl.org/dc/terms/modified";
    return {
      inserts: changeset.inserts.filter(filterFn),
      deletes: changeset.deletes.filter(filterFn),
    };
  });
}

export function mapToSubjects(changesets: Changeset[]) {
  const subjects = new Set<string>();
  for (const changeset of changesets) {
    changeset.inserts.forEach((insert) => {
      subjects.add(insert.subject.value as string);
    });
  }
  return Array.from(subjects);
}