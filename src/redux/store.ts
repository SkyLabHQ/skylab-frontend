import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reducer as appState } from "./app-slice";

const rootReducer = combineReducers({
    appState,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (gDW) => gDW({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
