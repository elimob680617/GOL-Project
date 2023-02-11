import { PayloadAction, createSlice } from '@reduxjs/toolkit';
// types
import {
  AuthState,
  ForgetPasswordPayloadType,
  ForgetPasswordpVerficationPayloadType,
  NGOCompanyUserInfoPayloadType,
  NormalUserInfoPayloadType,
  SignUpBasicInfoPaylodType,
  SignUpByPayloadType,
  SignUpUserTypePaylodType,
  SignUpVerficationPayloadType,
} from 'src/types/auth';
import { RootState } from 'src/store';
import { UserDto, EmailOrPhoneNumberEnum } from 'src/types/serverTypes'

const initialState: AuthState = {
  signUpValues: {
    userType: '',
    verificationCode: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    fullName: '',
    signUpBy: 'email',
  },
  forgotPasswordValues: {
    username: '',
    verificationCode: '',
    usernameType: EmailOrPhoneNumberEnum.Email,
  },
  user: null
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUpUserTypeDefined(state, action: PayloadAction<SignUpUserTypePaylodType>) {
      state.signUpValues = { ...state.signUpValues, ...action.payload };
    },
    updateSignUpBasicInfo(state, action: PayloadAction<SignUpBasicInfoPaylodType>) {
      state.signUpValues = { ...state.signUpValues, ...action.payload };
    },
    signUpBy(state, action: PayloadAction<SignUpByPayloadType>) {
      state.signUpValues = { ...state.signUpValues, ...action.payload, username: '' };
    },
    normalUsreInfoUpdated(state, action: PayloadAction<NormalUserInfoPayloadType>) {
      state.signUpValues = { ...state.signUpValues, ...action.payload };
    },
    NGOCompanyUserInfoUpdated(state, action: PayloadAction<NGOCompanyUserInfoPayloadType>) {
      state.signUpValues = { ...state.signUpValues, ...action.payload };
    },
    verificationUpdated(state, action: PayloadAction<SignUpVerficationPayloadType>) {
      state.signUpValues = { ...state.signUpValues, ...action.payload };
    },
    forgetPasswordUpdated(state, action: PayloadAction<ForgetPasswordPayloadType>) {
      state.forgotPasswordValues = { ...state.forgotPasswordValues, ...action.payload };
    },
    forgetPasswordVerificationUpdated(
      state,
      action: PayloadAction<ForgetPasswordpVerficationPayloadType>,
    ) {
      state.forgotPasswordValues = { ...state.forgotPasswordValues, ...action.payload };
    },
    setUser(state, action: PayloadAction<UserDto & {isAuthenticated?: boolean}>) {
      state.user = action.payload;
    }
  },
});

export const basicInfoSelector = (state: RootState) => ({
  username: state.auth.signUpValues.username,
  password: state.auth.signUpValues.password,
});
export const signUpUserTypeSelector = (state: RootState) => state.auth.signUpValues.userType;
export const signUpBySelector = (state: RootState) => state.auth.signUpValues.signUpBy;
// export const signUpUserTypeSelector = (state: RootState) => state.auth.signUpValues.userType;
export const normalUserInfoSelector = (state: RootState) => ({
  firstName: state.auth.signUpValues.firstName,
  lastName: state.auth.signUpValues.lastName,
});
export const ngoCompanyUserInfoSelector = (state: RootState) => ({
  fullName: state.auth.signUpValues.fullName,
});
export const forgetPasswordUsernameSelector = (state: RootState) => ({
  username: state.auth.forgotPasswordValues.username,
  usernameType: state.auth.forgotPasswordValues.usernameType,
});
export const resetUserPasswordSelector = (state: RootState) => ({
  username: state.auth.forgotPasswordValues.username,
  verificationCode: state.auth.forgotPasswordValues.verificationCode,
});
export const userSelector = (state: RootState) => ({
  user: state.auth.user,
});

// Reducer
export default slice.reducer;

// Actions
export const {
  signUpUserTypeDefined,
  updateSignUpBasicInfo,
  normalUsreInfoUpdated,
  NGOCompanyUserInfoUpdated,
  verificationUpdated,
  forgetPasswordUpdated,
  forgetPasswordVerificationUpdated,
  signUpBy,
  setUser
} = slice.actions;
