import React from 'react';
import { Provider, createClient, useQuery } from 'urql';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query =  `
  query($MeasurementQuery: [MeasurementQuery]){
    getMultipleMeasurements(input:$MeasurementQuery)
      {
        measurements{
          at,
          value,
          unit,
        }
      }
    }
`;


const Graph= ({measurements, metric}) =>{

  var data = [];
  var dataSeries = { type: "line" };
  var dataPoints = [];
  measurements.measurements.forEach((e,_Index) => {
    let moment = new Date(parseInt(e.at))
    dataPoints.push({x:moment,y:e.value})
  });
  dataSeries.dataPoints = dataPoints;
  data.push(dataSeries);

  const spanStyle = {
    position:'absolute', 
    top: '10px',
    fontSize: '20px', 
    fontWeight: 'bold', 
    backgroundColor: '#d85757',
    padding: '0px 4px',
    color: '#ffffff'
  }
  
  const options = {
    zoomEnabled: false,
    animationEnabled: true,
    title: {
      text: metric.metric
    },
    axisY: {
      includeZero: false
    },
    data: data  // random data
  }
  
  
return ( <CanvasJSChart options = {options} />)
} 

export default (metric) => {
  return (
    <Provider value={client}>
      <Measurement metric={metric}/>
    </Provider>
  );
};

const Measurement =  ({metric}) => {
  const date = new Date().getTime()
  const after = date -(30*60*1000)
  const MeasurementQuery = {
    metricName:metric.metric,
    after: after,
    before: date
  };

  const [result] = useQuery({
    query,
    variables:{ 
     MeasurementQuery
    }
    ,
  });
  const { data, error } = result;

  let  measurements  = null

  if (data) {
    measurements  = data.getMultipleMeasurements[0]
  }
  
  if (! measurements) {
    return <div></div>
  }else
  return (<Graph measurements={measurements} metric={metric}/>);
};
