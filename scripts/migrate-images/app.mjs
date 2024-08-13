import { querySudo } from "@lblod/mu-auth-sudo";

async function main() {
  const images = await getAllImageLinks();
  console.log(images);

}

async function getAllImageLinks() {
  const q = `
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>     
      select distinct ?roadSign ?imageUri ?imageId where {
         ?roadSign a <https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept>;
              <https://data.vlaanderen.be/ns/mobiliteit#grafischeWeergave> ?imageUri.
         BIND(
            IF(CONTAINS(?imageUri, "/files/"), 
              REPLACE(?imageUri, "^.*/files/([a-zA-Z0-9]+).*", "$1"),
            ""
         ) AS ?imageId)
      } 
  `;
  const res = await querySudo(q);
  return res.results.bindings;
}

main().then();
