export default [
  {
    match: {
      predicate: {
        type: "uri",
        value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
      },
    },
    callback: {
      method: "POST",
      url: "http://tombstone/delta",
    },
    options: {
      resourceFormat: "v0.0.1",
      gracePeriod: 1000,
      ignoreFromSelf: true,
    },
  },
  {
    match: {},
    callback: {
      url: "http://resource/.mu/delta",
      method: "POST",
    },
    options: {
      resourceFormat: "v0.0.1",
      gracePeriod: 250,
      ignoreFromSelf: true,
    },
  },
  {
    match: {
      // any
    },
    callback: {
      url: "http://ldes-delta-pusher/publish",
      method: "POST",
    },
    options: {
      resourceFormat: "v0.0.1",
      ignoreFromSelf: false,
      optOutMuScopeIds: [
        "http://redpencil.data.gift/id/concept/muScope/deltas/initialSync",
        "http://redpencil.data.gift/id/concept/muScope/deltas/publicationGraphMaintenance",
      ],
      gracePeriod: 1000,
    },
  },
  {
    match: {
      predicate: {
        type: "uri",
        value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
      },
    },
    callback: {
      url: "http://annotater/delta",
      method: "POST",
    },
    options: {
      resourceFormat: "v0.0.1",
      ignoreFromSelf: true,
      gracePeriod: 250,
    },
  },
  {
    match: {
      subject: {},
    },
    callback: {
      url: "http://modified/delta",
      method: "POST",
    },
    options: {
      resourceFormat: "v0.0.1",
      gracePeriod: 10000,
      retry: 3,
      ignoreFromSelf: true,
      retryTimeout: 250,
    },
  },
];
