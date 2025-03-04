import { querySudo, updateSudo } from "@lblod/mu-auth-sudo";
import { v4 as uuid } from "uuid";
import { Readable } from "stream";
import { finished } from "stream/promises";
import path from "path";
import { createWriteStream } from "fs";
import { stat, writeFile } from "fs/promises";
process.env.MU_SPARQL_ENDPOINT = "http://triplestore:8890/sparql";
const MOW_BASE_URL = process.env.MOW_BASE_URL || "https://roadsigns.lblod.info";
const MOW_GRAPH =
  process.env.MOW_GRAPH || "http://mu.semte.ch/graphs/mow/registry";

const FILE_PATH = process.env.FILE_PATH || "/project/data/files";
const ACCEPTED_CONTENT_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};
const csvReport = [
  ["roadsign", "imageUri", "imageId", "extern", "note"].join(","),
];

async function main() {
  const images = await getAllImageLinks();
  for (const image of images) {
    let fileObjectUri;
    let extern = "yes";
    if (image.imageId?.length) {
      //  probably image on disk
      extern = "no";
      fileObjectUri = await getFileObjectUriFromUUID(image.imageId);
      if (!fileObjectUri) {
        console.log(`fileObject doesn't exist for ${image.imageId}`);
        csvReport.push([
          image.roadSign,
          `"${image.imageUri}"`,
          image.imageId,
          extern,
          "we could extract an image id but that uuid was not in db",
        ]);
        continue;
      }
    } else {
      // probably extern
      try {
        fileObjectUri = await downloadImage(image.imageUri);
      } catch (e) {
        console.log(`an error occurred for  ${image.imageUri}: ${e}`);
        csvReport.push([
          image.roadSign,
          `"${image.imageUri}"`,
          image.imageId,
          extern,
          "could not download image: " + e,
        ]);
        continue;
      }
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

    csvReport.push([
      image.roadSign,
      `"${image.imageUri}"`,
      image.imageId,
      extern,
      "upadated with image: " + imageResource,
    ]);
  }

  await writeFile(
    path.join(FILE_PATH, "csvReport" + new Date().getTime() + ".csv"),
    csvReport.join("\n"),
    { encoding: "utf-8" },
  );
}

async function downloadImage(imageUri) {
  if (imageUri?.startsWith("/static")) {
    imageUri = `http://static-file${imageUri}`;
  }
  const res = await fetch(imageUri);
  if (res.status !== 200) {
    throw `status error while downloading image ${imageUri}: ${res.status}`;
  }
  const contentType = res.headers.get("Content-Type");
  if (
    !Object.keys(ACCEPTED_CONTENT_TYPES).includes(contentType?.toLowerCase())
  ) {
    throw `unknown content type for ${imageUri}: ${contentType}`;
  }
  const phyId = uuid();
  const extension = ACCEPTED_CONTENT_TYPES[contentType.toLowerCase()];
  const fileName = `${phyId}.${extension}`;
  const physicalFile = `share://${fileName}`;

  const destination = path.resolve(FILE_PATH, fileName);
  const fileStream = createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  const st = await stat(destination);
  const now = new Date();
  const loId = uuid();
  const logicalFile = `http://data.lblod.info/id/files/${loId}`;
  await updateSudo(`
      PREFIX nfo: <http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>
      PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX dbpedia: <http://dbpedia.org/ontology/>
      INSERT DATA {
        GRAPH ${sparqlEscapeUri(MOW_GRAPH)} {
          ${sparqlEscapeUri(physicalFile)} a nfo:FileDataObject;
                                  nie:dataSource ${sparqlEscapeUri(logicalFile)} ;
                                  mu:uuid ${sparqlEscapeString(phyId)};
                                  nfo:fileName ${sparqlEscapeString(fileName)} ;
                                  dct:creator <http://lblod.data.gift/services/migrate-images-script>;
                                  dct:created ${sparqlEscapeDateTime(now)};
                                  dct:modified ${sparqlEscapeDateTime(now)};
                                  dct:format "${contentType}";
                                  nfo:fileSize ${sparqlEscapeInt(st.size)};
                                  dbpedia:fileExtension "${extension}".
          ${sparqlEscapeUri(logicalFile)} a nfo:FileDataObject;
                                  mu:uuid ${sparqlEscapeString(loId)};
                                  nfo:fileName ${sparqlEscapeString(fileName)} ;
                                  dct:creator <http://lblod.data.gift/services/migrate-images-script>;
                                  dct:created ${sparqlEscapeDateTime(now)};
                                  dct:modified ${sparqlEscapeDateTime(now)};
                                  dct:format "${contentType}";
                                  nfo:fileSize ${sparqlEscapeInt(st.size)};
                                  dbpedia:fileExtension "${extension}" .
        }
      }
`);

  return logicalFile;
}

async function getFileUUID(fileObjectUri) {
  const q = `
       PREFIX mu: <http://mu.semte.ch/vocabularies/core/>     
       SELECT ?id where {
           <${fileObjectUri}> mu:uuid ?id
       } LIMIT 1
    `;
  const res = await querySudo(q);

  if (!res.results.bindings?.length) {
    return null;
  }
  return res.results.bindings[0].id.value;
}

async function convertToImageResource(fileObjectUri) {
  let id = uuid();
  let uri = `http://mobiliteit.vo.data.gift/images/${id}`;
  const fileUuid = await getFileUUID(fileObjectUri);
  const updateQuery = `
       PREFIX foaf: <http://xmlns.com/foaf/0.1/>
       PREFIX mu: <http://mu.semte.ch/vocabularies/core/>     
       PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
       PREFIX dcat: <http://www.w3.org/ns/dcat#> 
       INSERT DATA {
          GRAPH <${MOW_GRAPH}> {
             <${uri}> a foaf:Document, foaf:Image;
                    ext:hasFile <${fileObjectUri}>;
                    dcat:downloadURL <${MOW_BASE_URL}/files/${fileUuid}/download>;
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
         ?roadSign <https://data.vlaanderen.be/ns/mobiliteit#grafischeWeergave> ?imageUri.
         BIND(
            IF(CONTAINS(?imageUri, "/files/"), 
              REPLACE(?imageUri, "^.*/files/([a-zA-Z0-9]+).*", "$1"),
            ""
         ) AS ?imageId)
         filter(isLiteral(?imageUri))
      } 
  `;
  const res = await querySudo(q);
  return res.results.bindings?.map((e) => {
    return {
      roadSign: e.roadSign.value,
      imageUri: e.imageUri.value,
      imageId: e.imageId.value,
    };
  });
}

function sparqlEscapeString(value) {
  return (
    '"""' +
    value.replace(/[\\"]/g, function (match) {
      return "\\" + match;
    }) +
    '"""'
  );
}

function sparqlEscapeUri(value) {
  return (
    "<" +
    value.replace(/[\\"<>]/g, function (match) {
      return "\\" + match;
    }) +
    ">"
  );
}

function sparqlEscapeInt(value) {
  return '"' + Number.parseInt(value) + '"^^xsd:integer';
}

function sparqlEscapeDateTime(value) {
  return '"' + new Date(value).toISOString() + '"^^xsd:dateTime';
}

main().then();
