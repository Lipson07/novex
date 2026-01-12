
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import user from "./user";
import theme from "./theme";

const persistUser = {
  key: "user",
  storage,
  whitelist: ["id","name", "email", "password", "isVerified"],
};

const persistTheme = {
  key: "theme",
  storage,
  whitelist: ["currentTheme"],
};

const persistUserReducer = persistReducer(persistUser, user);
const persistThemeReducer = persistReducer(persistTheme, theme);

const store = configureStore({
  reducer: {
    user: persistUserReducer,
    theme: persistThemeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;