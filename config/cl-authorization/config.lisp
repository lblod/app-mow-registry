;;;;;;;;;;;;;;;;;;;
;;; delta messenger
(in-package :delta-messenger)

(setf *delta-handlers* nil)
(add-delta-logger)
(add-delta-messenger "http://deltanotifier/")

;;;;;;;;;;;;;;;;;
;;; configuration
(in-package :client)
(setf *log-sparql-query-roundtrip* t)
(setf *backend* "http://triplestore:8890/sparql")

;;;;;;;;;;;;;;;;;
;;; access rights

(in-package :acl)

(defparameter *access-specifications* nil
  "All known ACCESS specifications.")

(defparameter *graphs* nil
  "All known GRAPH-SPECIFICATION instances.")

(defparameter *rights* nil
  "All known GRANT instances connecting ACCESS-SPECIFICATION to GRAPH.")


(define-prefixes
  :lblodmow "http://data.lblod.info/vocabularies/mobiliteit/"
  :dct "http://purl.org/dc/terms/"
  :skos "http://www.w3.org/2004/02/skos/core#"
  :org "http://www.w3.org/ns/org#"
  :mobiliteit "https://data.vlaanderen.be/ns/mobiliteit#"
  :vs "http://www.w3.org/2003/06/sw-vocab-status/ns#"
  :ext "http://mu.semte.ch/vocabularies/ext/"
  :cidoc "http://www.cidoc-crm.org/cidoc-crm/"
  :qudt "http://qudt.org/schema/qudt/"
  :foaf "http://xmlns.com/foaf/0.1/"
  :nfo "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#"
  :rdfs "http://www.w3.org/2000/01/rdf-schema#"
  :sh "http://www.w3.org/ns/shacl#"
  :tribont "https://w3id.org/tribont/core#"
  :musession "http://mu.semte.ch/vocabularies/session/"
  :variables "http://lblod.data.gift/vocabularies/variables/"
  :besluit "http://data.vlaanderen.be/ns/besluit#"
)

(define-graph mow-public-graph ("http://mu.semte.ch/graphs/mow/registry")
  ("cidoc:E54_Dimension" -> _)
  ("qudt:Unit" -> _)
  ("qudt:QuantityKind" -> _)
  ("skos:ConceptScheme" -> _)
  ("skos:Concept" -> _)
  ("lblodmow:Codelist" -> _)
  ("ext:CodeListValue" -> _)
  ("mobiliteit:Verkeersbordconcept" -> _)
  ("mobiliteit:Verkeerstekenconcept" -> _)
  ("mobiliteit:Verkeersbordcategorie" -> _)
  ("mobiliteit:VerkeersbordconceptStatus" -> _)
  ("mobiliteit:VerkeersbordconceptStatusCode" -> _)
  ("mobiliteit:Wegmarkeringconcept" -> _)
  ("mobiliteit:Verkeerslichtconcept" -> _)
  ("mobiliteit:Mobiliteitmaatregelconcept" -> _)
  ("mobiliteit:Template" -> _)
  ("mobiliteit:Pictogram" -> _)
  ("foaf:Image" -> _)
  ("foaf:Document" -> _)
  ("nfo:FileDataObject" -> _)
  ("rdfs:Resource" -> _)
  ("sh:Shape" -> _)
  ("sh:PropertyShape" -> _)
  ("sh:NodeShape" -> _)
  ("tribont:Shape" -> _)
  ("ext:ShapeClassificatieCode" -> _)
  ("ext:Concept" -> _)
  ("ext:Resource" -> _)
  ("variables:Variable" -> _)
)

(define-graph public-graph ("http://mu.semte.ch/graphs/public")
  ("besluit:Bestuurseenheid" -> _)
)

(define-graph mow-admin-graph ("http://mu.semte.ch/graphs/mow/registry")
  ("cidoc:E54_Dimension" -> _)
  ("skos:ConceptScheme" -> _)
  ("skos:Concept" -> _)
  ("lblodmow:Codelist" -> _)
  ("ext:CodeListValue" -> _)
  ("mobiliteit:Verkeersbordconcept" -> _)
  ("mobiliteit:Verkeerstekenconcept" -> _)
  ("mobiliteit:Verkeersbordcategorie" -> _)
  ("mobiliteit:VerkeersbordconceptStatus" -> _)
  ("mobiliteit:VerkeersbordconceptStatusCode" -> _)
  ("mobiliteit:Wegmarkeringconcept" -> _)
  ("mobiliteit:Verkeerslichtconcept" -> _)
  ("mobiliteit:Template" -> _)
  ("mobiliteit:Pictogram" -> _)
  ("mobiliteit:Mobiliteitmaatregelconcept" -> _)
  ("foaf:Image" -> _)
  ("foaf:Document" -> _)
  ("nfo:FileDataObject" -> _)
  ("rdfs:Resource" -> _)
  ("sh:Shape" -> _)
  ("sh:PropertyShape" -> _)
  ("sh:NodeShape" -> _)
  ("tribont:Shape" -> _)
  ("ext:Concept" -> _)
  ("ext:Resource" -> _)
  ("variables:Variable" -> _)
)

(supply-allowed-group "logged-in-user"
  :parameters ()
  :query "PREFIX session: <http://mu.semte.ch/vocabularies/session/>
      SELECT DISTINCT ?account WHERE {
      <SESSION_ID> session:account ?account.
      }"
)

(grant (read write)
       :to-graph  mow-admin-graph
       :for-allowed-group "logged-in-user")

(supply-allowed-group "public")

(grant (read)
       :to-graph mow-public-graph
       :for-allowed-group "public")

(grant (read)
       :to-graph public-graph
       :for-allowed-group "public")
       
(in-package :support)
;; setting the string-max-size to nil assures us that strings will never be converted to files
(defparameter *string-max-size* nil
  "Maximum size of a string before it gets converted.")