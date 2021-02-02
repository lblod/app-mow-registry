(in-package :mu-cl-resources)
(read-domain-file "domain.json")

;; (define-resource roadsigncombination ()
;;   :class (s-prefix "lblodmow:Verkeersbordcombinatie")
;;   :properties `((:identifier :string ,(s-prefix "dct:identifier")))
;;   :has-many `((measureconcept :via ,(s-prefix "dct:hasPart")
;;                                  :as "measureconcepts"))
;;   :resource-base (s-url "http://data.lblod.info/verkeersbordcombinaties/")
;;   :on-path "roadsigncombinations")
  

;; (define-resource measureconcept ()
;;   :class (s-prefix "lblodmow:MaatregelConcept")
;;   :properties `((:description :string ,(s-prefix "dct:description")))
;;   :has-one `((roadsigncombination :via ,(s-prefix "dct:hasPart")
;;                                      :inverse t
;;                                      :as "roadsigncombinations")
;;              (roadsignconcept :via ,(s-prefix "lblodmow:verkeersbordconcept")
;;                                   :as "roadsignconcept"))
;;   :resource-base (s-url "http://data.lblod.info/maatregelconcepten/")
;;   :on-path "measureconcepts")

;; (define-resource roadsignconcept ()
;;   :class (s-prefix "mobiliteit:Verkeersbordconcept")
;;   :properties `((:image :url ,(s-prefix "mobiliteit:grafischeWeergave"))
;;                 (:meaning :string ,(s-prefix "skos:scopeNote"))
;;                 (:roadsignconceptcode :string ,(s-prefix "skos:prefLabel"))
;;                 )
;;   :has-one `((roadsignconcept-status-code :via ,(s-url "http://www.w3.org/2003/06/sw-vocab-status/ns#term_status")
;;                                          :as "status"))
;;   :has-many `((roadsigncategory :via ,(s-prefix "org:classification")
;;                                       :as "category")
;;               (measureconcept :via ,(s-prefix "lblodmow:verkeersbordconcept")
;;                                       :inverse t
;;                                       :as "measureconcepts"))
;;   :resource-base (s-url "http://data.lblod.info/verkeersbordconcepten/")
;;   :on-path "roadsignconcepts")

;; (define-resource roadsigncategory ()
;;   :class (s-prefix "mobiliteit:Verkeersbordcategorie")
;;   :properties `((:label :string ,(s-prefix "skos:prefLabel")))
;;   :has-many `((roadsignconcept :via ,(s-prefix "org:classification")
;;                                    :inverse t
;;                                    :as "roadsignconcepts"))
;;   :resource-base (s-url "http://data.lblod.info/verkeersbordcategorieen/")
;;   :on-path "roadsigncategories"
;;   )

;; (define-resource roadsignconcept-status-code ()
;;   :class (s-prefix "lblodmow:VerkeersbordconceptStatusCode")
;;   :properties `((:label :string ,(s-prefix "skos:prefLabel")))
;;   :has-many `((roadsignconcept :via ,(s-url "http://www.w3.org/2003/06/sw-vocab-status/ns#term_status")
;;                                    :inverse t
;;                                    :as "roadsignconcepts"))
;;   :resource-base (s-url "http://data.lblod.info/verkeersbordconcept-status-codes/")
;;   :on-path "roadsignconcept-status-codes"
;;   )




(defparameter *include-count-in-paginated-responses* t)
(defparameter *cache-count-queries-p* t)
(defparameter *supply-cache-headers-p* t)