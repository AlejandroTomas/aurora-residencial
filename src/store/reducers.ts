import { combineReducers } from "@reduxjs/toolkit";
import { createReducer } from "async-selector-kit";

export const reducers = combineReducers({
  AsyncSelector: createReducer(),
});

export type RootState = ReturnType<typeof reducers>;
