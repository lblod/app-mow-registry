import { Changeset } from "../types";

export const interestingTypes = [
  "http://www.cidoc-crm.org/cidoc-crm/E54_Dimension",
  "http://qudt.org/schema/qudt/Unit",
  "http://qudt.org/schema/qudt/QuantityKind",
  "http://mu.semte.ch/vocabularies/ext/ShapeClassificatieCode",
  "http://xmlns.com/foaf/0.1/Document",
  "http://mu.semte.ch/vocabularies/ext/Concept",
  "http://xmlns.com/foaf/0.1/Image",
  "https://www.w3.org/ns/activitystreams#Tombstone",
  "http://data.lblod.info/vocabularies/mobiliteit/Codelist",
  "http://data.lblod.info/vocabularies/mobiliteit/VerkeersbordconceptStatusCode",
  "https://data.vlaanderen.be/ns/mobiliteit#Mobiliteitmaatregelconcept",
  "https://data.vlaanderen.be/ns/mobiliteit#Pictogram",
  "https://data.vlaanderen.be/ns/mobiliteit#Template",
  "http://lblod.data.gift/vocabularies/variables/Variable",
  "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordcategorie",
  "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept",
  "https://data.vlaanderen.be/ns/mobiliteit#VerkeersbordconceptStatus",
  "https://data.vlaanderen.be/ns/mobiliteit#Verkeerslichtconcept",
  "https://data.vlaanderen.be/ns/mobiliteit#Verkeerstekenconcept",
  "https://data.vlaanderen.be/ns/mobiliteit#Wegmarkeringconcept",
  "http://www.w3.org/2000/01/rdf-schema#Resource",
  "http://www.w3.org/2004/02/skos/core#Concept",
  "http://www.w3.org/2004/02/skos/core#ConceptScheme",
  "https://w3id.org/tribont/core#Shape",
];

export const filterModifiedSubjects = "";

export async function filterDeltas(changeSets: Changeset[]) {
  const modifiedPred = "http://purl.org/dc/terms/modified";
  const subjectsWithModified = new Set();

  const trackModifiedSubjects = (quad) => {
    if (quad.predicate.value === modifiedPred) {
      subjectsWithModified.add(quad.subject.value);
    }
  };
  changeSets.forEach((changeSet) => {
    changeSet.inserts.forEach(trackModifiedSubjects);
  });

  const isGoodQuad = (quad) => !subjectsWithModified.has(quad.subject.value);
  return changeSets.map((changeSet) => {
    return {
      inserts: changeSet.inserts.filter(isGoodQuad),
      deletes: changeSet.deletes.filter(isGoodQuad),
    };
  });
}
