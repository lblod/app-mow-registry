(in-package :mu-cl-resources)
(read-domain-file "domain.json")

(defparameter *include-count-in-paginated-responses* t)
;(defparameter *cache-count-queries-p* t)
;(defparameter *supply-cache-headers-p* t)

(defparameter *max-group-sorted-properties* nil)