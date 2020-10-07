import { createSlice } from "@reduxjs/toolkit";
import { create as createOnServer, keep as keepOnServer } from "./server";

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
    set: (state, action) => {
      const {
        description,
        tn,
        ring,
        skill,
        step,
        rolledDices,
        keptDices,
        keepSelection,
      } = action.payload;
      state.step = step;
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;

      state.rolledDices = rolledDices;
      state.keptDices = keptDices;

      state.keepSelection = keepSelection;
    },
    softReset: (state) => {
      state.step = initialState.step;
      state.rolledDices = undefined;
      state.keptDices = undefined;

      state.keepSelection = undefined;
    },
  },
});

const { set } = slice.actions;
export const { softReset } = slice.actions;

export const create = (request) => (dispatch) => {
  createOnServer(request).then((response) => {
    dispatch(set(response));
  });
};

export const keep = (roll, request) => (dispatch) => {
  keepOnServer(roll, request).then((response) => {
    dispatch(set(response));
  });
};

export const selectAll = (state) => state.roll;

export default slice.reducer;
