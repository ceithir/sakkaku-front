import { createSlice } from "@reduxjs/toolkit";
import {
  create as createOnServer,
  keep as keepOnServer,
  explode as explodeOnServer,
  keepTemporary as keepTemporaryOnServer,
  discardTemporary as discardTemporaryOnServer,
} from "./server";

const initialState = {
  description: "Example",
  tn: 1,
  ring: 1,
  skill: 1,
  dices: [],
  temporaryDices: [],
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
        temporaryDices,
        dices,
      } = action.payload;
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;

      state.dices = dices;
      state.temporaryDices = temporaryDices;
    },
    softReset: (state) => {
      state.dices = [];
      state.temporaryDices = [];
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

export const explodeDie = (roll, die) => (dispatch) => {
  explodeOnServer(roll, die).then((response) => {
    dispatch(set(response));
  });
};

export const keepTemporary = (roll, index) => (dispatch) => {
  keepTemporaryOnServer(roll, index).then((response) => {
    dispatch(set(response));
  });
};

export const discardTemporary = (roll, index) => (dispatch) => {
  discardTemporaryOnServer(roll, index).then((response) => {
    dispatch(set(response));
  });
};

export const selectAll = (state) => state.roll;

export default slice.reducer;
