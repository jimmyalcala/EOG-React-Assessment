import { createSlice, PayloadAction } from 'redux-starter-kit';

export type getMetrics =   []


export type ApiErrorAction = {
  error: string
};

const initialState = {
    getMetrics:[]
};


const slice = createSlice({
  name: 'getMetrics',
  initialState,
  reducers: {
    getMetricsDataRecevied: (state, action: PayloadAction<getMetrics>) => {
        state.getMetrics = action.payload;
    },
    getMetricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
