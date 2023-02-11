import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CertificateType, profileCertificateState } from 'src/types/profile/userCertificate';
import { RootState } from 'src/store';

const initialState: profileCertificateState = {};

const slice = createSlice({
  name: 'userCertificate',
  initialState,
  reducers: {
    certificateUpdated(state, action: PayloadAction<CertificateType>) {
      state.certificate = { ...state.certificate, ...action.payload };
    },
    certificateCleared(state) {
      state.certificate = undefined;
    },
  },
});

export const userCertificateSelector = (state: RootState) => state.userCertificates.certificate;

export default slice.reducer;

export const { certificateUpdated, certificateCleared } = slice.actions;
