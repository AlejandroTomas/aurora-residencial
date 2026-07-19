// hooks/useReduxHooks.ts
import store from "@/store";
import { RootState } from "@/store/reducers";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";


export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
