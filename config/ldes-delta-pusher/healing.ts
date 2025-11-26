export type HealingConfig = Awaited<ReturnType<typeof getHealingConfig>>;
export const getHealingConfig = async () => {
  return {
    // this is the name of a stream, you can have multiple streams in the config,
    // the healing process will check them one by one sequentially
    "ldes-mow-register": {
      entities: {
        "http://www.cidoc-crm.org/cidoc-crm/E54_Dimension": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://qudt.org/schema/qudt/Unit": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://qudt.org/schema/qudt/QuantityKind": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://mu.semte.ch/vocabularies/ext/ShapeClassificatieCode": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://xmlns.com/foaf/0.1/Document": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://mu.semte.ch/vocabularies/ext/Concept": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://xmlns.com/foaf/0.1/Image": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://www.w3.org/ns/activitystreams#Tombstone": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://data.lblod.info/vocabularies/mobiliteit/Codelist": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://data.lblod.info/vocabularies/mobiliteit/VerkeersbordconceptStatusCode":
          ["http://purl.org/dc/terms/modified"],
        "https://data.vlaanderen.be/ns/mobiliteit#Mobiliteitmaatregelconcept": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Pictogram": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Template": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://lblod.data.gift/vocabularies/variables/Variable": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordcategorie": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#VerkeersbordconceptStatus": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Verkeerslichtconcept": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Verkeerstekenconcept": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://data.vlaanderen.be/ns/mobiliteit#Wegmarkeringconcept": [
          "http://purl.org/dc/terms/modified",
        ],
        'https://data.vlaanderen.be/ns/mobiliteit#MaatregelVerkeerstekenLijstItem': [
          "http://purl.org/dc/terms/modified",
        ],
        "http://www.w3.org/2000/01/rdf-schema#Resource": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://www.w3.org/2004/02/skos/core#Concept": [
          "http://purl.org/dc/terms/modified",
        ],
        "http://www.w3.org/2004/02/skos/core#ConceptScheme": [
          "http://purl.org/dc/terms/modified",
        ],
        "https://w3id.org/tribont/core#Shape": [
          "http://purl.org/dc/terms/modified",
        ],
      },
    },
  };
};
