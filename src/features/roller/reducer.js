import { createSlice } from "@reduxjs/toolkit";
import { postOnServer, authentifiedPostOnServer } from "../../server";
import { DECLARE, REROLL, KEEP, RESOLVE } from "./Steps";

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
  error: false,
};

const slice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    softReset: (state) => {
      state.dices = [];
      state.metadata = {};
      state.modifiers = [];
      state.id = null;
      window.history.pushState(null, null, "/");
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
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;
      state.modifiers = modifiers;
    },
    setDices: (state, action) => {
      state.dices = action.payload;
    },
    setMetadata: (state, action) => {
      state.metadata = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setId: (state, action) => {
      const id = action.payload;
      state.id = id;
      window.history.pushState(null, null, `/rolls/${id}`);
    },
    setPlayer: (state, action) => {
      state.player = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAnimatedStep: (state, action) => {
      state.animatedStep = action.payload;
    },
  },
});

export const {
  setParameters,
  setDices,
  setMetadata,
  setLoading,
  setId,
  setPlayer,
  softReset,
  setAnimatedStep,
} = slice.actions;

const { setError } = slice.actions;

export const create = (request, user) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setParameters(request));

  const error = () => {
    dispatch(setError(true));
  };

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
        dispatch(setDices(data["dices"]));
        dispatch(setId(data["id"]));
        dispatch(setPlayer(user));
        dispatch(setLoading(false));
      },
      error,
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
      dispatch(setDices(data["dices"]));
      dispatch(setLoading(false));
    },
    error,
  });
};

export const reroll = (roll, positions, modifier) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(setDices(data["dices"]));
    dispatch(setMetadata(data["metadata"]));
    dispatch(setLoading(false));
  };
  const error = () => {
    dispatch(setError(true));
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
      error,
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
    error,
  });
};

export const keep = (roll, positions) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(setDices(data["dices"]));
    dispatch(setLoading(false));
  };
  const error = () => {
    dispatch(setError(true));
  };

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/keep`,
      body: {
        positions,
      },
      success,
      error,
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
    error,
  });
};

export const selectAll = (state) => state.roll;
export const selectLoading = (state) => state.roll.loading;
export const selectStep = (state) => {
  const { dices, metadata, modifiers, animatedStep } = state.roll;

  if (animatedStep) {
    return animatedStep;
  }

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");
  const hasReroll =
    modifiers.includes("adversity") || modifiers.includes("distinction");
  const rerollDone = metadata?.rerolls?.length || !hasReroll;

  if (dicesRolled && rerollDone && !atLeastOneUnresolvedDice) {
    return RESOLVE;
  }

  if (dicesRolled && rerollDone) {
    return KEEP;
  }

  if (dicesRolled && hasReroll) {
    return REROLL;
  }

  return DECLARE;
};
export const selectIntent = (state) => {
  const {
    campaign,
    character,
    description,
    tn,
    ring,
    skill,
    modifiers,
    player,
  } = state.roll;

  return {
    campaign,
    character,
    description,
    tn,
    ring,
    skill,
    modifiers,
    player,
  };
};
export const selectHidden = (state) =>
  state.roll.loading && !state.roll.animatedStep;

export default slice.reducer;
