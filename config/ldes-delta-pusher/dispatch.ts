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
        construct {
            ?s  ?p ?o
        } where {
            VALUES ?s {${sparqlEscapeUri(subject)} }
            ?s a ?type; ?p ?o
            filter (?type in (
                rdfs:Resource,
                skos:ConceptScheme,
                lblodmow:Codelist,
                skos:Concept,
                ext:Concept,
                ext:Template,
                ext:Mapping,
                ext:Relation,
                ext:CanBeCombinedWithRelation,
                ext:MustUseRelation,
                lblodmow:TrafficMeasureConcept,
                mobiliteit:Verkeersbordconcept,
                mobiliteit:Wegmarkeringconcept,
                mobiliteit:Verkeerslichtconcept,
                mobiliteit:Verkeersbordcategorie,
                mobiliteit:VerkeersbordconceptStatus,
                lblodmow:VerkeersbordconceptStatusCode
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
