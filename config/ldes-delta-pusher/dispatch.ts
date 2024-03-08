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
        construct {
            ?s  ?p ?o
        } where {
            VALUES ?s {${sparqlEscapeUri(subject)} }
            ?s ?p ?o
          
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
