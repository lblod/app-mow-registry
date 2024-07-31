export default [
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
      ignoreFromSelf: true,
      optOutMuScopeIds: [
        "http://redpencil.data.gift/id/concept/muScope/deltas/initialSync",
        "http://redpencil.data.gift/id/concept/muScope/deltas/publicationGraphMaintenance",
      ],
      gracePeriod: 1000,
    },
  },
];
