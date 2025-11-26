import { RESOURCE_TYPES } from "./constants";

export type HealingConfig = Awaited<ReturnType<typeof getHealingConfig>>;
export const getHealingConfig = async () => {
  return {
    // this is the name of a stream, you can have multiple streams in the config,
    // the healing process will check them one by one sequentially
    "ldes-mow-register": {
      entities: Object.fromEntries(
        RESOURCE_TYPES.map((type) => [
          type,
          ["http://purl.org/dc/terms/modified"],
        ])
      ),
    },
  };
};
