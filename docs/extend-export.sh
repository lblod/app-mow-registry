#!/bin/sh
if [ -z "$1" ]
then
  echo "Expecting ttl file with exported data as argument"
else
  docker run --rm -v $(pwd):$(pwd) -w $(pwd) bdevloed/eye extend-export.n3 ${1} --nope > extended_export.ttl
fi
