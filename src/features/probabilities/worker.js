import { cumulativeSuccess } from "./maths";

export const asyncCumulativeSuccess = (params) => {
  postMessage({ type: "custom", params, result: cumulativeSuccess(params) });
};
