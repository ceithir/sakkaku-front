import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "semiauto",
  help: false,
};

const slice = createSlice({
  name: "rollConfig",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setHelp: (state, action) => {
      state.help = action.payload;
    },
  },
});

export const { setMode, setHelp } = slice.actions;

export const selectMode = (state) => state.rollConfig.mode;
export const selectHelp = (state) => state.rollConfig.help;

export default slice.reducer;
