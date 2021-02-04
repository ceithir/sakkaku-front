import { createSlice } from "@reduxjs/toolkit";
import { postOnServer } from "../../server";

const slice = createSlice({
  name: "heritage",
  initialState: {
    dices: [],
    loading: false,
    error: null,
    metadata: {},
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
      state.dices = [];
      state.metadata = {};
    },
  },
});

export const { setLoading, setError, update, reset } = slice.actions;

export const create = (metadata) => (dispatch) => {
  dispatch(setLoading(true));

  const error = (e) => {
    dispatch(setError(e));
  };

  postOnServer({
    uri: "/public/ffg/l5r/heritage-rolls/create",
    body: { metadata },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const keep = (roll, position) => (dispatch) => {
  dispatch(setLoading(true));

  const error = (e) => {
    dispatch(setError(e));
  };

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
  return { dices: state.heritage.dices, metadata: state.heritage.metadata };
};

export default slice.reducer;
