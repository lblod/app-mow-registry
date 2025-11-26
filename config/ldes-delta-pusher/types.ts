export type Term = {
  type: string;
  datatype?: string;
  value: string | number | boolean;
};

export type Quad = {
  subject: Term;
  predicate: Term;
  object: Term;
};

export type Changeset = {
  inserts: Quad[];
  deletes: Quad[];
};
