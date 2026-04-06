import { z } from "zod";

// Custom schema function

// Extend Zod's capabilities with the custom function
export const Validation = {
  ...z,
  schema: z.object,
};
