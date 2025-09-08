(in-package :mu-cl-resources)

(defparameter *include-count-in-paginated-responses* t)
(defparameter *supply-cache-headers-p* t)
(defparameter *cache-model-properties* t)
(defparameter *cache-count-queries* t)
(defparameter *default-page-size* 1000)
;;; fixes bug in sorting - parameter is a workaround for virtuoso behaviour (see docs) but cause problems for sorting
(defparameter *max-group-sorted-properties* nil)
(defparameter *use-custom-boolean-type-p* nil)
(read-domain-file "file-service.json")
(read-domain-file "domain.json")
(read-domain-file "auth.json")

;;; fixes a bug with the 2 relationships that use the mobiliteit:template
;;; predicate: measure->template and variable->template
;;;
;;; Basically, measures contain a template, and variables with the "instruction"
;;; type also contain a template.
;;; Both use the same predicate: mobiliteit:template.
;;; In theory there's nothing wrong with this. But in our specific case it
;;; triggers a bug in resources, specifically because we access the
;;; measure->template relationship in the *inverse* direction.
;;;
;;; What happens is the following: resources gets a request on
;;; /templates/<id>/parentConcept, meaning, "I have a template, give me its
;;; parent concept (the measure)
;;; To resolve this, resources makes a query that looks like:
;;; SELECT ?uuid WHERE {
;;;    <templateUri> ^mobiliteit:template ?thing.
;;;    ?thing mu:uuid ?uuid.
;;; } 
;;; Note the caret syntax inverting the triple pattern.
;;; Now, because a template has 2 different types of things (Variables and
;;; Measures) it can "belong to" with the mobiliteit:template predicate, 
;;; this query can give multiple results, in a random order. 
;;; Resources takes the first result, and then continues.
;;;
;;; At a later stage in processing, it uses the "knowledge" that the uuid belongs
;;; to a resource of a specific type: a Measure (because it says so in the
;;; config!) 
;;; But! Since it didn't typecheck the uuid query, this can actually be a wrong
;;; assumption in this case. Somewhere down the road, resources gives up and
;;; throws a 500 (without printing any errors, unfortunately - but see below)
;;;
;;; So, rather complicated to explain, but the fix is almost trivial: simply add a
;;; type constraint to that initial uuid query, ensuring you either get a uuid of
;;; the correct type, or you get nothing, which is what you want.
;;;
;;; While the below code looks scary, it just reimplements the internal function
;;; that sends that query, adding the type constraint.
;;;
;;; (thanks to @madnificent for this fix)
(defgeneric retrieve-relation-items (item-spec link)
  (:documentation "retrieves the item descriptions of the items
    which are connected to <resource> <id> through link <link>.
    This yields the high-level description of the items, not
    their contents.
    Note that this method does not support pagination.")
  (:method ((item-spec item-spec) (link string))
    (retrieve-relation-items item-spec (find-link-by-json-name (resource item-spec) link)))
  (:method ((item-spec item-spec) (link has-one-link))
    (let* ((resource-url (s-url (node-url item-spec)))
           (query-results
             (first (sparql:select (s-var "uuid")
                                   (format nil
                                           (s+ "~A ~{~A~,^/~} ?resource. "
                                               "VALUES ?class {~{~A~^ ~}}."
                                               "?resource mu:uuid ?uuid; "
                                               "          a ?class. "
                                               "~@[~A~] ")
                                           resource-url
                                           (ld-property-list link)
                                           (ld-subclasses (find-resource-by-name (resource-name link)))
                                           (authorization-query (resource item-spec) :show resource-url)))))
           (linked-resource (resource-name (referred-resource link))))
      (and query-results
         (list
          (make-item-spec :type linked-resource
                          :uuid (jsown:filter query-results "uuid" "value"))))))
  (:method ((item-spec item-spec) (link has-many-link))
    (let* ((resource-url (s-url (node-url item-spec)))
           (query-results
            (sparql:select (s-var "uuid")
                           (format nil (s+ "~A ~{~A~,^/~} ?resource. "
                                           "?resource mu:uuid ?uuid. "
                                           "~@[~A~] ")
                                   resource-url
                                   (ld-property-list link)
                                   (authorization-query item-spec :show resource-url))))
           (linked-resource (resource-name (referred-resource link))))
      (loop for uuid in (jsown:filter query-results map "uuid" "value")
         collect
           (make-item-spec :type linked-resource :uuid uuid)))))

;;; This is a debugging override which is related to the above fix. 
;;; DO NOT ENABLE FOR PRODUCTION CODE
;;; with this override, the behavior described above prints a stacktrace to the
;;; console instead of erroring silently
;;;
;;; (defun handle-relation-get-call (base-path id relation)
;;;   (let* ((resource (find-resource-by-path base-path))
;;;          (link (find-resource-link-by-path resource relation)))
;;;     (show-relation-call resource id link)))
