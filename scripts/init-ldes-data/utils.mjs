export function sparqlEscapeUri(value) {
  return (
    "<" +
    value.replace(/[\\"<>]/g, function (match) {
      return "\\" + match;
    }) +
    ">"
  );
}
