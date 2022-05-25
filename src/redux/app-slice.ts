import { createSlice } from "@reduxjs/toolkit";

export interface AppState {}

const initialState: AppState = {};

const { reducer, actions } = createSlice({
    name: "appState",
    initialState,
    reducers: {},
});

export { reducer, actions as appAction };
