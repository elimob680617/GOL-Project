import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'src/store';
import { PersonEmailType, ProfileEmailsState } from 'src/types/profile/userEmails';

const initialState: ProfileEmailsState = {
  emails: [],
  //   email: {},
};

const slice = createSlice({
  name: 'userEmails',
  initialState,
  reducers: {
    addedEmail(state, action: PayloadAction<PersonEmailType>) {
      // state.emails = { ...state.email, ...action.payload };
      state.email = action.payload;
    },
    emptyEmail(state, action: PayloadAction<PersonEmailType>) {
      state.email = undefined;
    },
  },
});

export const userEmailsSelector = (state: RootState) => state.userEmails.email;

export default slice.reducer;

export const { addedEmail, emptyEmail } = slice.actions;
