import { createSlice } from "@reduxjs/toolkit";
import { postOnServer, authentifiedPostOnServer } from "../../server";
import { v4 as uuidv4 } from "uuid";

const slice = createSlice({
  name: "heritage",
  initialState: {
    dices: [],
    loading: false,
    error: null,
    metadata: {},
    previousRolls: [],
    context: {},
    uuid: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    update: (state, action) => {
      const { dices, metadata } = action.payload;
      state.dices = dices;
      state.metadata = metadata;
      state.loading = false;
    },
    reset: (state) => {
      const uuid = state.uuid || uuidv4();
      if (
        !state.previousRolls.some(
          ({ uuid: existingUuid }) => uuid === existingUuid
        )
      ) {
        state.previousRolls = [
          {
            dices: state.dices,
            metadata: state.metadata,
            context: state.context,
            uuid,
            temporary: !state.uuid,
          },
          ...state.previousRolls,
        ];
      }

      state.dices = [];
      state.metadata = {};
      state.context = {};
      state.uuid = null;
      window.history.pushState(null, null, `/heritage`);
    },
    setContext: (state, action) => {
      state.context = action.payload;
    },
    setUuid: (state, action) => {
      const uuid = action.payload;
      state.uuid = uuid;
      window.history.pushState(null, null, `/heritage/${uuid}`);
    },
    load: (state, action) => {
      const { uuid, dices, metadata, context, temporary } = action.payload;
      state.uuid = uuid;
      state.dices = dices;
      state.metadata = metadata;
      state.context = context;
      if (!temporary) {
        window.history.pushState(null, null, `/heritage/${uuid}`);
      }
    },
  },
});

export const { setLoading, setError, reset, load } = slice.actions;

const { update, setContext, setUuid } = slice.actions;

export const create = ({ context, metadata, user }) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setContext({ ...context, user }));

  const error = (e) => {
    dispatch(setError(e));
  };

  if (user) {
    const { campaign, character, description } = context;

    authentifiedPostOnServer({
      uri: "/ffg/l5r/heritage-rolls/create",
      body: {
        campaign,
        character,
        description,
        metadata,
      },
      success: ({ uuid, roll }) => {
        dispatch(setUuid(uuid));
        dispatch(update(roll));
      },
      error,
    });
    return;
  }

  postOnServer({
    uri: "/public/ffg/l5r/heritage-rolls/create",
    body: { metadata },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const keep = ({ roll, position, user }) => (dispatch) => {
  dispatch(setLoading(true));

  const error = (e) => {
    dispatch(setError(e));
  };

  if (user) {
    const { uuid } = roll;
    authentifiedPostOnServer({
      uri: `/ffg/l5r/heritage-rolls/${uuid}/keep`,
      body: {
        position,
      },
      success: ({ roll }) => {
        dispatch(update(roll));
      },
      error,
    });
    return;
  }

  postOnServer({
    uri: "/public/ffg/l5r/heritage-rolls/keep",
    body: { roll, position },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const selectLoading = (state) => state.heritage.loading;
export const selectError = (state) => state.heritage.error;
export const selectRoll = (state) => {
  return {
    uuid: state.heritage.uuid,
    dices: state.heritage.dices,
    metadata: state.heritage.metadata,
  };
};
export const selectPreviousRolls = (state) => state.heritage.previousRolls;
export const selectContext = (state) => state.heritage.context;

export default slice.reducer;
