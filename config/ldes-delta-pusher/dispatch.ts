import { moveTriples } from "../support";
import { Changeset } from "../types";
import { query, sparqlEscapeUri } from "mu";

export default async function dispatch(changesets: Changeset[]) {
  console.log('dispatching...');
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
        construct {
            ?s  a <https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept>; 
                mu:uuid ?uuid; 
                mobiliteit:grafischeWeergave ?icon;
                skos:prefLabel ?label.
        } where {
            VALUES ?s {${sparqlEscapeUri(subject)}}
            ?s  a <https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept>; 
                mu:uuid ?uuid;
                mobiliteit:grafischeWeergave ?icon;
                skos:prefLabel ?label.
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
