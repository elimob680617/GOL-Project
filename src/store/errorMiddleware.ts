import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  // const { enqueueSnackbar } = useSnackbar();
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    const errMsg = action.payload.message.replace('GraphQL.ExecutionError: ', '');
    const indexOfErr = errMsg.indexOf(':');
    if(JSON.parse(errMsg.split('.:')[1])?.response?.errors?.[0]?.extensions?.code === "401"){
      localStorage.removeItem('accessToken');
      window.location = '/auth/sign-in' as any;}

    toast(errMsg.slice(0, indexOfErr), { type: 'error' });
  }

  return next(action);
};
