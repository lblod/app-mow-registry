alias Acl.Accessibility.Always, as: AlwaysAccessible
alias Acl.GraphSpec.Constraint.Resource, as: ResourceConstraint
alias Acl.GraphSpec.Constraint.ResourceFormat, as: ResourceFormatConstraint
alias Acl.Accessibility.ByQuery, as: AccessByQuery
alias Acl.GraphSpec, as: GraphSpec
alias Acl.GroupSpec, as: GroupSpec
alias Acl.GroupSpec.GraphCleanup, as: GraphCleanup

defmodule Acl.UserGroups.Config do
  defp access_by_role_for_single_graph( group_string ) do
    %AccessByQuery{
      vars: [],
      query: sparql_query_for_access_role( group_string ) }
  end

  defp sparql_query_for_access_role( group_string ) do
    "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    SELECT ?session_group ?session_role WHERE {
      <SESSION_ID> ext:sessionGroup/mu:uuid ?session_group;
                   ext:sessionRole ?session_role.
      FILTER( ?session_role = \"#{group_string}\" )
    }"
  end

  def user_groups do
    [
      %GroupSpec{
        name: "mow-admin",
        useage: [:read, :write, :read_for_write],
        access: access_by_role_for_single_graph( "MowAdmin" ),
        graphs: [ %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/mow/registry",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://www.w3.org/2004/02/skos/core#ConceptScheme",
                        "http://www.w3.org/2004/02/skos/core#Concept",
                        "http://data.lblod.info/vocabularies/mobiliteit/Codelist",
                        "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept",
                        "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordcategorie",
                        "https://data.vlaanderen.be/ns/mobiliteit#VerkeersbordconceptStatus",
                        "https://data.vlaanderen.be/ns/mobiliteit#Wegmarkeringconcept",
                        "https://data.vlaanderen.be/ns/mobiliteit#Verkeerslichtconcept",
                        "http://xmlns.com/foaf/0.1/Image",
                        "http://data.lblod.info/vocabularies/mobiliteit/VerkeersbordconceptStatusCode",
                        "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject",
                        "http://www.w3.org/2000/01/rdf-schema#Resource",
                        "http://www.w3.org/ns/shacl#Shape",
                        "http://www.w3.org/ns/shacl#PropertyShape",
                        "http://www.w3.org/ns/shacl#NodeShape",
                        "http://mu.semte.ch/vocabularies/ext/Template",
                        "http://mu.semte.ch/vocabularies/ext/Mapping",
                        "http://mu.semte.ch/vocabularies/ext/Relation",
                        "http://mu.semte.ch/vocabularies/ext/CanBeCombinedWithRelation",
                        "http://mu.semte.ch/vocabularies/ext/MustUseRelation",
                        "http://mu.semte.ch/vocabularies/ext/Concept",
                        "http://mu.semte.ch/vocabularies/ext/Resource",
                        "http://data.lblod.info/vocabularies/mobiliteit/TrafficMeasureConcept",
                      ] } } ] },
      %GroupSpec{
        name: "public",
        useage: [:read],
        access: %AlwaysAccessible{}, 
        graphs: [
          %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/mow/registry",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://www.w3.org/2004/02/skos/core#ConceptScheme",
                        "http://www.w3.org/2004/02/skos/core#Concept",
                        "http://data.lblod.info/vocabularies/mobiliteit/Codelist",
                        "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordconcept",
                        "https://data.vlaanderen.be/ns/mobiliteit#Verkeersbordcategorie",
                        "https://data.vlaanderen.be/ns/mobiliteit#VerkeersbordconceptStatus",
                        "https://data.vlaanderen.be/ns/mobiliteit#Wegmarkeringconcept",
                        "https://data.vlaanderen.be/ns/mobiliteit#Verkeerslichtconcept",
                        "http://xmlns.com/foaf/0.1/Image",
                        "http://data.lblod.info/vocabularies/mobiliteit/VerkeersbordconceptStatusCode",
                        "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#FileDataObject",
                        "http://www.w3.org/2000/01/rdf-schema#Resource",
                        "http://www.w3.org/ns/shacl#Shape",
                        "http://www.w3.org/ns/shacl#PropertyShape",
                        "http://www.w3.org/ns/shacl#NodeShape",
                        "http://mu.semte.ch/vocabularies/ext/Template",
                        "http://mu.semte.ch/vocabularies/ext/Mapping",
                        "http://mu.semte.ch/vocabularies/ext/Relation",
                        "http://mu.semte.ch/vocabularies/ext/CanBeCombinedWithRelation",
                        "http://mu.semte.ch/vocabularies/ext/MustUseRelation",
                        "http://mu.semte.ch/vocabularies/ext/Concept",
                        "http://mu.semte.ch/vocabularies/ext/Resource",
                        "http://data.lblod.info/vocabularies/mobiliteit/TrafficMeasureConcept",
                      ] } },
          %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/public",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://data.vlaanderen.be/ns/besluit#Bestuurseenheid"
                      ]
                    } } ] },
  
      # ORGANIZATION HAS POSSIBLY DUPLICATE USER DATA
      %GroupSpec{
        name: "org",
        useage: [:read],
        access: %AccessByQuery{
          vars: ["session_group"],
          query: "PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
                  PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
                  SELECT ?session_group ?session_role WHERE {
                    <SESSION_ID> ext:sessionGroup/mu:uuid ?session_group.
                    }" },
        graphs: [ %GraphSpec{
                    graph: "http://mu.semte.ch/graphs/organizations/",
                    constraint: %ResourceConstraint{
                      resource_types: [
                        "http://xmlns.com/foaf/0.1/Person",
                        "http://xmlns.com/foaf/0.1/OnlineAccount",
                        "http://www.w3.org/ns/adms#Identifier",
                      ] } } ] },
      # CLEANUP
      %GraphCleanup{
        originating_graph: "http://mu.semte.ch/application",
        useage: [:read, :write],
        name: "clean"
      }
    ]
  end
end
