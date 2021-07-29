import { createSlice } from "@reduxjs/toolkit";

const namespace = "HMRpb9OPyoEmg3Oqa4Xi85KdUWOARlFX";
const store = (namespace) => {
  const fullKey = (key) => `${namespace}-${key}`;

  return {
    get: (key, fallback) => {
      const item = window.localStorage.getItem(fullKey(key));
      if (item === null) {
        return fallback;
      }
      return item;
    },
    set: (key, value) => {
      window.localStorage.setItem(fullKey(key), value);
    },
  };
};
const { get, set } = store(namespace);

const initialState = {
  mode: "semiauto",
  displayMode: "compact",
};

const slice = createSlice({
  name: "rollConfig",
  initialState: (() => {
    let obj = {};
    for (const key in initialState) {
      obj[key] = get(key, initialState[key]);
    }
    return obj;
  })(),
  reducers: {
    updateConfig: (state, { payload }) => {
      for (const key in payload) {
        state[key] = payload[key];
        set(key, payload[key]);
      }
    },
  },
});

export const { updateConfig } = slice.actions;

export const selectMode = (state) => state.rollConfig.mode;
export const selectDisplayMode = (state) => state.rollConfig.displayMode;
export const selectConfig = (state) => state.rollConfig;

export default slice.reducer;
