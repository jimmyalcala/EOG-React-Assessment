import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '../../components/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { makeStyles } from '@material-ui/core/styles';


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
{
    getMetrics
}
`;

const getListMetrics = (state: IState) => {
  const { getMetrics } = state.metrics;
  return {
    getMetrics
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
    metric: string,
}

const useStyles = makeStyles({
    card: {
        display:'flex',
        flexDirection: 'column',
        height:'500px',
        minWidth: '500px',
        margin:'10px'
    },
    metrics:{
        display: 'flex',
        flexWrap: 'wrap'

    }
  });

const MetricCard = ({metric} : CardProps) => {
    const classes = useStyles();
    return( 
        <Card className={classes.card}>
            <CardHeader title={metric} />    
            <CardContent>   
                <p>valor</p> 
            </CardContent>    

        </Card>
    )
}



const Metrics = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { getMetrics } = useSelector(getListMetrics);
  const [result] = useQuery({
    query,
  });

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.getMetricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.getMetricsDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return <div className={classes.metrics}>
      {getMetrics.map( metric => <MetricCard metric={metric} key={metric}/>)}
  </div>;
};
