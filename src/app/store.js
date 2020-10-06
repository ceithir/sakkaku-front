import { configureStore } from "@reduxjs/toolkit";
import rollerReducer from "../features/roller/reducer";

export default configureStore({
  reducer: {
    roll: rollerReducer,
  },
});
