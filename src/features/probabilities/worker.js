import { chances } from "./maths";

export const asyncChances = (params) => {
  postMessage({ type: "custom", params, result: chances(params) });
};
