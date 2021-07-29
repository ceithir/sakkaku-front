import { configureStore } from "@reduxjs/toolkit";
import rollerReducer from "../features/roller/reducer";
import userReducer from "../features/user/reducer";
import heritageReducer from "../features/heritage/reducer";
import rollerConfigReducer from "../features/roller/config/reducer";

export default configureStore({
  reducer: {
    roll: rollerReducer,
    rollConfig: rollerConfigReducer,
    user: userReducer,
    heritage: heritageReducer,
  },
});
