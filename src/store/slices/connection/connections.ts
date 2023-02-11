import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { FollowerResDto, RequestEnum, StatusEnum } from 'src/types/serverTypes';

type InitialState = {
  connections: FollowerResDto[];
  loading: boolean;
};

const initialState: InitialState = {
  connections: [],
  loading: false,
};

export const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    onLoadConnections: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    onGetConnections: (state, action: PayloadAction<any>) => {
      state.connections = action.payload;
      state.loading = false;
    },
    onUpdateConnections: (state, action: PayloadAction<any>) => {
      const updatedList = [...state.connections, ...action.payload];
      state.connections = updatedList;
      state.loading = false;
    },
    onResetConnections: (state) => {
      state.connections = [];
    },
    onFollow: (
      state,
      action: PayloadAction<{ index: number; meToOther: StatusEnum; otherToMe: StatusEnum }>,
    ) => {
      const temp = state.connections[action.payload.index];
      state.connections.splice(action.payload.index, 1, {
        ...temp,
        meToOtherStatus: action.payload.meToOther,
        otherToMeStatus: action.payload.otherToMe,
      });
    },
    onChangeStatus: (
      state,
      action: PayloadAction<{
        index: number;
        otherToMe: StatusEnum;
        meToOther: StatusEnum;
        actionType: RequestEnum;
      }>,
    ) => {
      const temp = state.connections[action.payload.index];
      if (
        action.payload.actionType === RequestEnum.Block ||
        action.payload.actionType === RequestEnum.Remove
      ) {
        state.connections.splice(action.payload.index, 1);
      } else {
        state.connections.splice(action.payload.index, 1, {
          ...temp,
          otherToMeStatus: action.payload.otherToMe,
          meToOtherStatus: action.payload.meToOther,
        });
      }
    },
  },
});

export const {
  onGetConnections,
  onUpdateConnections,
  onLoadConnections,
  onResetConnections,
  onFollow,
  onChangeStatus,
} = connectionSlice.actions;

export default connectionSlice.reducer;
