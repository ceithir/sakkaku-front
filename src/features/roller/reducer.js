import { createSlice } from "@reduxjs/toolkit";
import { push } from "./server";

const initialState = {
  step: "intent",
  tn: 1,
  ring: 1,
  skill: 1,
};

const slice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    localUpdate: (state, action) => {
      const { step } = action.payload;
      state.step = step;
    },
  },
});

const { localUpdate } = slice.actions;

export const update = (request) => (dispatch) => {
  push(request).then((response) => {
    dispatch(localUpdate(response));
  });
};
export const selectStep = (state) => state.roll.step;
export const selectAll = (state) => state.roll;

export default slice.reducer;
