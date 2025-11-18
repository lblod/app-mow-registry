import { querySudo, updateSudo } from "@lblod/mu-auth-sudo";
import { sparqlEscapeUri } from "mu";
import { objectify } from "./utils";

export async function enrichWithDownloadURLs(subjects: string[], urlBase: string) {
  const {
    results: { bindings },
  } = await querySudo(/* sparql */ `
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX dcat: <http://www.w3.org/ns/dcat#>
  
      SELECT DISTINCT ?image ?file ?fileId ?downloadURL WHERE {
          GRAPH <http://mu.semte.ch/graphs/mow/registry> {
            ?image 
              a foaf:Image; 
              ext:hasFile ?file.
            ?file mu:uuid ?fileId.
            OPTIONAL {
              ?image dcat:downloadURL ?downloadURL.
            }
          }
          VALUES ?image {${subjects.map((s) => sparqlEscapeUri(s)).join(" ")} }
      }
      `);
  for (const binding of bindings) {
    const { image, file, fileId, downloadURL } = objectify(binding);
    let newDownloadURL = new URL(
      `/files/${fileId}/download`,
      urlBase
    ).toString();
    if (newDownloadURL === downloadURL) {
      continue;
    }
    console.log(`Updating download URL for ${sparqlEscapeUri(image)}`)
    console.log('Old download URL: ', downloadURL);
    console.log('New download URL: ', newDownloadURL);
    await updateSudo(/* sparql */ `
      DELETE  {
        GRAPH <http://mu.semte.ch/graphs/mow/registry> {
          ${sparqlEscapeUri(image)} <http://www.w3.org/ns/dcat#downloadURL> ?oldDownloadUrl.
        }
      }
      INSERT  {
        GRAPH <http://mu.semte.ch/graphs/mow/registry> {
          ${sparqlEscapeUri(image)} <http://www.w3.org/ns/dcat#downloadURL> <${newDownloadURL.toString()}>.
        }
      }
      WHERE {
        GRAPH <http://mu.semte.ch/graphs/mow/registry> {
          OPTIONAL {${sparqlEscapeUri(image)} <http://www.w3.org/ns/dcat#downloadURL> ?oldDownloadUrl.}
        }
      }
    `);
  }
}
