import { querySudo, updateSudo } from "@lblod/mu-auth-sudo";
import { uuidv4 as uuid } from 'uuid';

const MOW_GRAPH = process.env.MOW_GRAPH || 'http://mu.semte.ch/graphs/mow/registry';
const csvReport = [
  ['roadsign', 'imageUri', 'imageId', 'extern', 'note'].join(',')
];

async function main() {
  const images = await getAllImageLinks();
  for (const image of images) {
    let fileObjectUri;
    let extern = 'yes';
    if (image.imageId?.length) {
      //  probably image on disk
      extern = 'no';
      fileObjectUri = await getFileObjectUriFromUUID(image.imageId);
      if (!fileObjectUri) {
        console.log(`fileObject doesn't exist for ${image.imageId}`);
        csvReport.push([image.roadSign, image.imageUri, image.imageId, extern, 'we could extract an image id but that uuid was not in db']);
        continue;
      }
    } else {
      // probably extern
      // TODO
    }
    const imageResource = await convertToImageResource(fileObjectUri);
    const updateQuery = `
          PREFIX mobiliteit: <https://data.vlaanderen.be/ns/mobiliteit#>
          DELETE {
            GRAPH <${MOW_GRAPH}> {
              <${image.roadSign}> mobiliteit:grafischeWeergave ?gw.

            }
          }
          INSERT {
            GRAPH <${MOW_GRAPH}> {
                <${image.roadSign}> mobiliteit:grafischeWeergave <${imageResource}>.

            }
          }
          WHERE {
            GRAPH <${MOW_GRAPH}> {
                <${image.roadSign}> mobiliteit:grafischeWeergave ?gw.

            }
          }

    `;
    await updateSudo(updateQuery);

  }

}

async function convertToImageResource(fileObjectUri) {
  let id = uuid();
  let uri = `http://mobiliteit.vo.data.gift/images/${id}`;
  const updateQuery = `
       PREFIX foaf: <http://xmlns.com/foaf/0.1/>
       PREFIX mu: <http://mu.semte.ch/vocabularies/core/>     
       INSERT DATA {
          GRAPH <${MOW_GRAPH}> {
             ${uri} a foaf:Document, foaf:Image;
                    ext:hasFile <${fileObjectUri}>;
                    mu:uuid "${id}".
          }
       }
   `;
  await updateSudo(updateQuery);
  return uri;

}


async function getFileObjectUriFromUUID(uuid) {
  const res = await querySudo(`
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>     
    select distinct ?fileObj where {
        ?fileObj mu:uuid "${uuid}"
    }
    `);
  if (!res.results.bindings?.length) {
    return null;
  }
  return res.results.bindings[0].fileObj.value;

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
  return res.results.bindings?.map(e => {
    return {
      roadSign: e.roadSign.value,
      imageUri: e.imageUri.value,
      imageId: e.imageId.value
    }
  });
}
main().then();
