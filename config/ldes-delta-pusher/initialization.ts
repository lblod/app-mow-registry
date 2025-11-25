import { RESOURCE_TYPES } from "./constants";

export const initialization = {
  "ldes-mow-register": Object.fromEntries(
    RESOURCE_TYPES.map((type) => [type, {}])
  ),
};
