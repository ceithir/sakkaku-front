import { createSlice } from "@reduxjs/toolkit";
import { postOnServer, authentifiedPostOnServer } from "../../server";

const initialState = {
  campaign: "Test campaign",
  character: "Test character",
  description: "Test roll",
  tn: 2,
  ring: 2,
  skill: 2,
  modifiers: [],
  dices: [],
  metadata: {},
  loading: false,
};

const slice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    softReset: (state) => {
      state.dices = [];
      state.metadata = {};
    },
    setParameters: (state, action) => {
      const {
        campaign,
        character,
        description,
        tn,
        ring,
        skill,
        modifiers,
      } = action.payload;
      state.campaign = campaign;
      state.character = character;
      state.character = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;
      state.modifiers = modifiers;
    },
    updateDices: (state, action) => {
      state.dices = action.payload;
    },
    setMetadata: (state, action) => {
      state.metadata = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setId: (state, action) => {
      state.id = action.id;
    },
  },
});

const {
  setParameters,
  updateDices,
  setMetadata,
  setLoading,
  setId,
} = slice.actions;
export const { softReset } = slice.actions;

export const create = (request, user) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setParameters(request));

  const {
    tn,
    ring,
    skill,
    modifiers,
    campaign,
    character,
    description,
  } = request;

  if (user) {
    authentifiedPostOnServer({
      uri: "/ffg/l5r/rolls/create",
      body: {
        tn,
        ring,
        skill,
        modifiers,
        campaign,
        character,
        description,
      },
      success: (data) => {
        dispatch(updateDices(data["dices"]));
        dispatch(setId(data["id"]));
        dispatch(setLoading(false));
      },
    });
    return;
  }

  postOnServer({
    uri: "/public/ffg/l5r/rolls/create",
    body: {
      tn,
      ring,
      skill,
      modifiers,
    },
    success: (data) => {
      dispatch(updateDices(data["dices"]));
      dispatch(setLoading(false));
    },
  });
};

export const reroll = (roll, positions, modifier) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(updateDices(data["dices"]));
    dispatch(setMetadata(data["metadata"]));
    dispatch(setLoading(false));
  };

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/reroll`,
      body: {
        positions,
        modifier,
      },
      success,
    });
    return;
  }

  const { tn, ring, skill, modifiers, dices } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/reroll",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
      },
      positions,
      modifier,
    },
    success,
  });
};

export const keep = (roll, positions) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(updateDices(data["dices"]));
    dispatch(setLoading(false));
  };

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/keep`,
      body: {
        positions,
      },
      success,
    });
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/keep",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      positions,
    },
    success,
  });
};

export const selectAll = (state) => state.roll;

export default slice.reducer;
