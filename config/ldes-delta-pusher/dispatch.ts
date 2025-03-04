import { moveTriples } from "../support";
import { Changeset } from "../types";
import { query, update, sparqlEscapeUri } from "mu";
import { URL } from "url";
const MOW_REGISTRY_BASE_URL = process.env.LDES_BASE;

if (!MOW_REGISTRY_BASE_URL) {
  throw "missing MOW_REGISTRY_BASE_URL";
}

console.log(MOW_REGISTRY_BASE_URL);
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
        PREFIX variables: <http://lblod.data.gift/vocabularies/variables/>
        PREFIX qudt: <http://qudt.org/schema/qudt/>

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
          let rdfType = bindings.find(
            (b) =>
              b.p.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
          );

          if (
            [
              "http://xmlns.com/foaf/0.1/Image",
              "http://xmlns.com/foaf/0.1/Document",
            ].includes(rdfType.o.value)
          ) {
            let downloadURL = bindings.find(
              (b) => b.p.value === "http://www.w3.org/ns/dcat#downloadURL",
            );
            let resp;

            let hasFile = bindings.find(
              (b) =>
                b.p.value === "http://mu.semte.ch/vocabularies/ext/hasFile",
            );

            if (hasFile)
              resp = await query(
                `select distinct ?id where {<${hasFile.o.value}> <http://mu.semte.ch/vocabularies/core/uuid> ?id} `,
              );

            if (!resp?.results?.bindings?.length) {
              console.error(
                `downloadURL: could not determine mu:uuid for <${hasFile}> and subject <${subject}>`,
              );
            } else {
              let fileUuid = resp.results.bindings[0].id.value;
              let newDownloadURL = new URL(
                `/files/${fileUuid}/download`,
                MOW_REGISTRY_BASE_URL,
              ).toString();
              // add downloadURL before inserting to ldes
              // delta notifier will be retriggered so we don't want to push to ldes twice
              // we should not set ignoreFromSelf to true in the deltanotifier config for this reason
              if (downloadURL?.o?.value !== newDownloadURL) {
                console.log(downloadURL, newDownloadURL);
                await update(`
                                    DELETE  {
                                        <${subject}> <http://www.w3.org/ns/dcat#downloadURL> ?oldDownloadUrl.
                                    }
                                    INSERT  {
                                        <${subject}> <http://www.w3.org/ns/dcat#downloadURL> <${newDownloadURL.toString()}>.
                                    }
                                    WHERE {
                                        OPTIONAL {<${subject}> <http://www.w3.org/ns/dcat#downloadURL> ?oldDownloadUrl.}
                                    }
                                `);
                continue;
              }
            }
          }
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
}
