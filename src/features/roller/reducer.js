import { createSlice } from "@reduxjs/toolkit";
import { postOnServer, authentifiedPostOnServer } from "../../server";
import { DECLARE, REROLL, KEEP, RESOLVE } from "./Steps";
import { REROLL_TYPES } from "./utils";

const initialState = {
  tn: 3,
  ring: 3,
  skill: 1,
  modifiers: [],
  dices: [],
  metadata: {},
  loading: false,
  error: false,
  toKeep: [],
  channeled: [],
  addkept: [],
  explicitGoToKeep: false,
};

const slice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    softReset: (state) => {
      state.tn = initialState.tn;
      state.ring = initialState.ring;
      state.skill = initialState.skill;
      state.description = null;
      state.dices = [];
      state.metadata = {};
      state.modifiers = [];
      state.toKeep = [];
      state.channeled = [];
      state.addkept = [];
      state.explicitGoToKeep = false;

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
        channeled,
        addkept,
      } = action.payload;
      state.campaign = campaign;
      state.character = character;
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;
      state.modifiers = modifiers;
      state.channeled = channeled;
      state.addkept = addkept;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAnimatedStep: (state, action) => {
      state.animatedStep = action.payload;
    },
    load: (state, action) => {
      const { id, player, dices, metadata } = action.payload;
      state.id = id;
      state.player = player;
      state.dices = dices;
      state.metadata = metadata;

      state.loading = false;
      window.history.pushState(null, null, `/rolls/${id}`);
      state.toKeep = [];
    },
    update: (state, action) => {
      const { dices, metadata } = action.payload;
      state.dices = dices;
      state.metadata = metadata;

      state.loading = false;
      state.toKeep = [];
    },
    setToKeep: (state, action) => {
      state.toKeep = action.payload;
    },
    setAddKept: (state, action) => {
      state.addkept = action.payload;
    },
    goToKeepStep: (state) => {
      state.explicitGoToKeep = true;
    },
  },
});

export const {
  setParameters,
  setLoading,
  softReset,
  setAnimatedStep,
  load,
  setToKeep,
  setAddKept,
  goToKeepStep,
} = slice.actions;

const { update, setError } = slice.actions;

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
    channeled,
    addkept,
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
        channeled,
        addkept,
      },
      success: (data) => {
        dispatch(load({ ...data, player: user }));
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
      channeled,
      addkept,
    },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const reroll = (roll, positions, modifier) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
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

  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/reroll",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      positions,
      modifier,
    },
    success,
    error,
  });
};

export const alter = (roll, alterations, modifier) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
  };
  const error = () => {
    dispatch(setError(true));
  };

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/alter`,
      body: {
        alterations,
        modifier,
      },
      success,
      error,
    });
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/alter",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      alterations,
      modifier,
    },
    success,
    error,
  });
};

export const keep = (roll, positions, toAdd) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
  };
  const error = () => {
    dispatch(setError(true));
  };

  const { id } = roll;
  if (id) {
    const authKeep = () =>
      authentifiedPostOnServer({
        uri: `/ffg/l5r/rolls/${id}/keep`,
        body: {
          positions,
        },
        success,
        error,
      });

    if (toAdd?.length) {
      authentifiedPostOnServer({
        uri: `/ffg/l5r/rolls/${id}/parameters`,
        body: {
          addkept: toAdd,
        },
        success: authKeep,
        error,
      });
      return;
    }

    authKeep();
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata, addkept } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/keep",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers, addkept },
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
  const {
    dices,
    metadata,
    modifiers,
    animatedStep,
    explicitGoToKeep,
  } = state.roll;

  if (animatedStep) {
    return animatedStep;
  }

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");

  const currentRerollModifiers = modifiers.filter((mod) =>
    REROLL_TYPES.includes(mod)
  );
  const hasReroll = currentRerollModifiers.length > 0;
  const rerollDone =
    !hasReroll || metadata?.rerolls?.length === currentRerollModifiers.length;

  if (dicesRolled && rerollDone && !atLeastOneUnresolvedDice) {
    return RESOLVE;
  }

  if (dicesRolled && rerollDone) {
    if (!explicitGoToKeep) {
      return REROLL;
    }

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
    channeled,
    addkept,
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
    channeled,
    addkept,
  };
};
export const selectHidden = (state) =>
  state.roll.loading && !state.roll.animatedStep;

export const selectToKeep = (state) => state.roll.toKeep;

export default slice.reducer;
