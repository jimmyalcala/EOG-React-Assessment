import { createSlice, PayloadAction } from 'redux-starter-kit';

export type metricType = {metric:string,
  at:number,
  value:number,
  unit:string
} 

export type getMetrics = [metricType]

export type ApiErrorAction = {
  error: string
};

const initialState = {
  metrics:[{metric:'oilTemp',
    at:0,
    value:196,
    unit:'F'
  }],
  metricSelected:'oilTemp'
};


const slice = createSlice({
  name: 'getMetrics',
  initialState,
  reducers: {
    selectMetric:(state, action: PayloadAction<string>)=>{
      state.metricSelected=action.payload
    },
    getMetricsDataRecevied: (state, action: PayloadAction<getMetrics>) => {
      const metricsArray = action.payload
    
      metricsArray.forEach((newMetric=>{
        let obj  = state.metrics.find(m => m.metric === newMetric.metric);
        let index = state.metrics.indexOf(obj as metricType);
          if (index===-1) {
            state.metrics.push({
            metric:newMetric.metric,
              at:newMetric.at,
              value:newMetric.value,
              unit:newMetric.unit})  
          }
          else{
            state.metrics[index]={
              metric:newMetric.metric,
              at:newMetric.at,
              value:newMetric.value,
              unit:newMetric.unit}
          }
        }))
        if (state.metrics[0].value===0) {
          state.metrics.splice(0,1)
        } 
    },
    getMetricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
