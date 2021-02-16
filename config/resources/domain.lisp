(in-package :mu-cl-resources)
(read-domain-file "domain.json")

(defparameter *include-count-in-paginated-responses* t)
;(defparameter *cache-count-queries-p* t)
;(defparameter *supply-cache-headers-p* t)

; fixes bug in sorting - parameter is a workaround for virtuoso behaviour (see docs) but cause problems for sorting
(defparameter *max-group-sorted-properties* nil)