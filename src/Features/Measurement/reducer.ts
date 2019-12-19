import { createSlice, PayloadAction } from 'redux-starter-kit';

export type measurementType = {
    at:number,
    value:number,
    unit:string
  } 

export type getMeasurements = [measurementType] 

export type ApiErrorAction = {
  error: string;
};

const initialState = {
    measurements:[{
        at:0,
        value:0,
        unit:'F'
    }]
}

const slice = createSlice({
  name: 'getMeasurements',
  initialState,
  reducers: {
    measurementsDataRecevied: (state, action: PayloadAction<getMeasurements>) => {
      const  measurements  = action.payload;
      state.measurements = measurements;
    },
    getMeasurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
