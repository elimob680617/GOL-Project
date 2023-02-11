import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfilePublicDetailsState, RelationshipType } from 'src/types/profile/publicDetails';
import { RootState } from 'src/store';

const initialState: ProfilePublicDetailsState = {};

const slice = createSlice({
  name: 'userRelationShip',
  initialState,
  reducers: {
    userRelationShipUpdate(state, action: PayloadAction<RelationshipType>) {
      state.relationShip = action.payload;
    },
    RelationShipCleared(state) {
      state.relationShip = undefined;
    },
  },
});
// useSelector(userRelationShipSelector)
export const userRelationShipSelector = (state: RootState) => state.userRelationShip.relationShip;

// Reducer
export default slice.reducer;

// Actions
export const { userRelationShipUpdate, RelationShipCleared } = slice.actions;
