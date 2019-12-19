import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '../../components/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, defaultExchanges, subscriptionExchange, useSubscription} from 'urql';
import { IState } from '../../store';
import { makeStyles } from '@material-ui/core/styles';
import { SubscriptionClient } from "subscriptions-transport-ws";
import Gauge from 'react-svg-gauge';

const subscriptionClient = new SubscriptionClient(
  "ws://react.eogresources.com/graphql",
  {
    reconnect: true,
    timeout: 20000
  }
);


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});


const newMeasurement = `
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`

const getListMetrics = (state: IState) => {
  const { metrics } = state.metrics;
  return {
    metrics
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

type CardProps = {
    metric: {
      metric:string,
      at:number,
      value:number,
      unit:string
    },
}

const useStyles = makeStyles({
    card: {
        display:'flex',
        flexDirection: 'column',
        height:'400px',
        minWidth: '400px',
        margin:'10px'
    },
    metrics:{
        display: 'flex',
        margin: '20px',
        overflowX:'scroll',
        cursor:'pointer'
    },
    unit:{
      color:'#2731427d',
    },
    gauge:{
      marginLeft:'-30px',
    }
  });

const MetricCard = ({metric} : CardProps) => {
    const classes = useStyles();
    let maxDefault=100
    switch (metric.unit) {
      case 'F':
        maxDefault = 1500;
        break;
      case 'PSI':
          maxDefault = 1000;
          break;
    
      default:
        break;
    }
    return( 
        <Card className={classes.card}>
            <CardHeader title={metric.metric} style={{ textAlign: 'center' }}/>    
            <CardContent>   
              <div className={classes.gauge}>
                <Gauge 
                  max={maxDefault} 
                  value={metric.value} 
                  width={400} 
                  height={300} 
                  label={metric.unit} 
                  topLabelStyle={{marginTop:150,fill: "#999999"}}
                  valueLabelStyle={{fontSize:50}}
                  minMaxLabelStyle={{fontSize: 20}} />
              </div>
            </CardContent>    

        </Card>
    )
}



const Metrics = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { metrics } = useSelector(getListMetrics);
  // const [result] = useQuery({
  //   query,
  // });

  const [result] = useSubscription({ query: newMeasurement }, (measurament = [], res) => {
    return [res.newMeasurement] 
  })

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.getMetricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    // console.log(data)
    // const { getMetrics } = data;
    dispatch(actions.getMetricsDataRecevied(data));
  }, [dispatch, data, error]);

  // if (fetching) return <LinearProgress />;
  return <div className={classes.metrics}>
      {metrics.map( metric =>  <MetricCard metric={metric} key={metric.metric}/>)}
  </div>;
};
