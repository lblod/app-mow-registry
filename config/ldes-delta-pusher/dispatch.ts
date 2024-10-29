import { moveTriples } from "../support";
import { Changeset } from "../types";
import { query, sparqlEscapeUri } from "mu";

export default async function dispatch(changesets: Changeset[]) {
  console.log("dispatching...");
  for (const changeset of changesets) {
    const subjects = new Set(
      changeset.inserts.map((insert) => insert.subject.value),
    );
    for (const subject of subjects) {
      const {
        results: { bindings },
      } = await query(`
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

        construct {
            ?s ?p ?o
        } where {
            VALUES ?s {${sparqlEscapeUri(subject)} }
            ?s a ?type; ?p ?o
            filter (?type in (
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
        `);
      if (bindings.length) {
        console.log("SUCCESS");
        await moveTriples([
          {
            inserts: bindings.map(({ s, p, o }) => {
              return { subject: s, predicate: p, object: o };
            }),
          },
        ]);
      }
    }
  }
}
