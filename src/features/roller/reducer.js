import { createSlice } from "@reduxjs/toolkit";
import {
  create as createOnServer,
  keep as keepOnServer,
  reroll as rerollOnServer,
} from "./server";

const initialState = {
  description: "Example",
  tn: 1,
  ring: 1,
  skill: 1,
  modifier: "none",
  dices: [],
  rerolled: false,
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
        modifier,
        dices,
        rerolled,
      } = action.payload;
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;
      state.modifier = modifier;

      state.dices = dices;
      state.rerolled = rerolled;
    },
    softReset: (state) => {
      state.dices = [];
      state.rerolled = false;
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

export const reroll = (roll, request) => (dispatch) => {
  rerollOnServer(roll, request).then((response) => {
    dispatch(set(response));
  });
};

export const selectAll = (state) => state.roll;

export default slice.reducer;
