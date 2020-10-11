import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  description: "Example",
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
        description,
        tn,
        ring,
        skill,
        modifiers,
        compromised,
      } = action.payload;
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;
      state.modifiers = modifiers;
      state.compromised = compromised;
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
  },
});

const { setParameters, updateDices, setMetadata, setLoading } = slice.actions;
export const { softReset } = slice.actions;

const serverRoot =
  process.env.NODE_ENV === "production" ? "/api" : "http://127.0.0.1:8000/api";

const postOnServer = async (uri, request, callback) => {
  try {
    const response = await fetch(`${serverRoot}${uri}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (![200, 201, 204].includes(response.status)) {
      throw new Error();
    }
    const data = await response.json();
    callback(data);
  } catch (_) {
    console.error("TODO");
  }
};

export const create = (request) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setParameters(request));

  const { tn, ring, skill, modifiers } = request;
  postOnServer(
    "/public/ffg/l5r/rolls/create",
    {
      tn,
      ring,
      skill,
      modifiers,
    },
    (data) => {
      dispatch(updateDices(data["dices"]));
      dispatch(setLoading(false));
    }
  );
};

export const reroll = (roll, positions, modifier) => (dispatch) => {
  dispatch(setLoading(true));
  const { tn, ring, skill, modifiers, dices } = roll;
  postOnServer(
    "/public/ffg/l5r/rolls/reroll",
    {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
      },
      positions,
      modifier,
    },
    (data) => {
      dispatch(updateDices(data["dices"]));
      dispatch(setMetadata(data["metadata"]));
      dispatch(setLoading(false));
    }
  );
};

export const keep = (roll, positions) => (dispatch) => {
  dispatch(setLoading(true));
  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer(
    "/public/ffg/l5r/rolls/keep",
    {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      positions,
    },
    (data) => {
      dispatch(updateDices(data["dices"]));
      dispatch(setLoading(false));
    }
  );
};

export const selectAll = (state) => state.roll;

export default slice.reducer;
