import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { personSkillType, profileSkillState } from 'src/types/profile/userSkill';
import { RootState } from 'src/store';

// initialState

const initialState: profileSkillState = {
  PersonSkillDto: {},
};

const slice = createSlice({
  name: 'userSkill',
  initialState,
  reducers: {
    skillUpdated(state, action: PayloadAction<personSkillType>) {
      state.PersonSkillDto = action.payload;
    },
  },
});

export const userSkillSelector = (state: RootState) => state.userPersonSkill.PersonSkillDto;

// reducer
export default slice.reducer;

// Action
export const { skillUpdated } = slice.actions;
