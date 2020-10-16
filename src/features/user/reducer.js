import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: {
    campaigns: [],
    characters: [],
  },
  reducers: {
    setUser: (state, action) => {
      const { id, name, campaigns, characters } = action.payload;
      state.id = id;
      state.name = name;
      state.campaigns = campaigns;
      state.characters = characters;
    },
    addCampaign: (state, action) => {
      const campaign = action.payload;
      if (!state.campaigns.includes(campaign)) {
        state.campaigns.push(campaign);
      }
    },
    addCharacter: (state, action) => {
      const character = action.payload;
      if (!state.characters.includes(character)) {
        state.characters.push(character);
      }
    },
  },
});

export const { setUser, addCampaign, addCharacter } = slice.actions;

export const selectUser = (state) => (state.user.id ? state.user : undefined);
export const selectCampaigns = (state) => state.user.campaigns;
export const selectCharacters = (state) => state.user.characters;

export default slice.reducer;
