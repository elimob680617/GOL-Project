import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import { rtkQueryErrorLogger } from './errorMiddleware';
import { rootReducer } from './rootReducer';

// middlewares
// import { middleware as cognitoMiddleware } from './COGNITOAPIs';
// import { middleware as profileMiddleware } from './PROFILEAPIs';
// import { middleware as postMiddleware } from './POSTAPIs';
// ----------------------------------------------------------------------

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(rtkQueryErrorLogger),
  // .concat(...cognitoMiddleware)
  // .concat(...profileMiddleware)
  // .concat(...postMiddleware),
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

const { dispatch } = store;

const useDispatch = () => useAppDispatch<AppDispatch>();

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, dispatch, useDispatch, useSelector };
