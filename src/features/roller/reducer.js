import { createSlice } from "@reduxjs/toolkit";
import { push } from "./server";

const initialState = {
  step: "intent",
  description: "Example",
  tn: 1,
  ring: 1,
  skill: 1,
};

const slice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    localUpdate: (state, action) => {
      const { step, unmodifiedRoll } = action.payload;
      state.step = step;
      state.unmodifiedRoll = unmodifiedRoll;
    },
    softReset: (state) => {
      state.step = initialState.step;
      state.unmodifiedRoll = undefined;
    },
  },
});

const { localUpdate } = slice.actions;
export const { softReset } = slice.actions;

export const update = (request) => (dispatch) => {
  push(request).then((response) => {
    dispatch(localUpdate(response));
  });
};
export const selectAll = (state) => state.roll;

export default slice.reducer;
