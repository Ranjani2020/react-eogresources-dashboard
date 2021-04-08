import React from "react";
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  Provider,
  createClient,
  useQuery,
  useSubscription,
  defaultExchanges,
  subscriptionExchange
} from "urql";
import Item from "./Item"


const useStyles = makeStyles({
  card: {
    marginTop: "2rem"
  }
});

const subscriptionClient = new SubscriptionClient("wss://react.eogresources.com/graphql", {
  reconnect: true,
  timeout: 30000,
});

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [...defaultExchanges, subscriptionExchange({
    forwardSubscription: operation => subscriptionClient.request(operation)
  })],
});

const measurementQuery = `
query($input: MeasurementQuery!) {
  getMeasurements(input: $input) {
    metric
    at
    value
    unit
  }
}
`;


const measurementSubscriptionQuery = `
subscription{
    newMeasurement{
        metric
        value
        unit
        at
    }
}

`;

const handleSubscription = (measurements = [], response) => {
  return [response.newMeasurement, ...measurements];
};

const getMetricData = (data, metric) => {
  const filteredData = data.filter(measurement => measurement.metric === metric);
  return filteredData.slice(0, 1).map(measurement => measurement.value);
}

export default (props) => {
  return (
    <Provider value={client}>
      <Dashboard {...props} />
    </Provider>
  );
};



const Dashboard = (props) => {
  const thirtyMinInterval = 30 * 60 * 1000;

  const classes = useStyles();

  const input = {
    metricName: String(props.metricName),
    before: parseInt(props.loadTimestamp),
    after: parseInt(props.loadTimestamp) - thirtyMinInterval,
  };

  const [result] = useQuery({
    query: measurementQuery,
    variables: {
      input,
    },
  });

  const [res] = useSubscription({ query: measurementSubscriptionQuery }, handleSubscription);
  if (!res.data) {
    return <p>No data</p>;
  }

  //MVP dashboard is now updating with working subscriptions.
  const tpData = getMetricData(res.data, "tubingPressure");
  const cpData = getMetricData(res.data, "casingPressure");
  const otData = getMetricData(res.data, "oilTemp");
  const ftData = getMetricData(res.data, "flareTemp");
  const wtData = getMetricData(res.data, "waterTemp");
  const injValveData = getMetricData(res.data, "injValveOpen");

  //the design intent here was on each click of the item, that selected metric's chart would load below to see historical data.
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
        px: 3
      }}
      className={classes.card}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >

          <Item
            textPrimary={"Tubing Pressure"}
            textSecondary={`${tpData} PSI`}
          />
          <Item
            textPrimary={"Casing Pressure"}
            textSecondary={`${cpData} PSI`}
          />
          <Item
            textPrimary={"Oil Temp"}
            textSecondary={`${otData} F`}
          />
          <Item
            textPrimary={"Flare Temp"}
            textSecondary={`${ftData} F`}
          />
          <Item
            textPrimary={"Water Temp"}
            textSecondary={`${wtData} F`}
          />
          <Item
            textPrimary={"injValve Open"}
            textSecondary={`${injValveData} %`}
          />
        </Grid>
      </Container>
    </Box>
  );
};
