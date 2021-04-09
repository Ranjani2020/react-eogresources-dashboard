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
import ChartContainer from "./ChartContainer"

const useStyles = makeStyles({
  card: {
    marginTop: "1rem"
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

const filterData = (data, metric) => {
  return data.filter(measurement => measurement.metric === metric);
}

const getMetricData = (data, metric) => {
  const filteredData = filterData(data, metric);
  return filteredData.slice(0, 1).map(measurement => measurement.value);
}

var selectedMetric = "";


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
            onClick={() => selectedMetric = "tubingPressure"}
          />
          <Item
            textPrimary={"Casing Pressure"}
            textSecondary={`${cpData} PSI`}
            onClick={() => selectedMetric = "casingPressure"}
          />
          <Item
            textPrimary={"Oil Temp"}
            textSecondary={`${otData} F`}
            onClick={() => selectedMetric = "oilTemp"}
          />
          <Item
            textPrimary={"Flare Temp"}
            textSecondary={`${ftData} F`}
            onClick={() => selectedMetric = "flareTemp"}
          />
          <Item
            textPrimary={"Water Temp"}
            textSecondary={`${wtData} F`}
            onClick={() => selectedMetric = "waterTemp"}
          />
          <Item
            textPrimary={"injValve Open"}
            textSecondary={`${injValveData} %`}
            onClick={() => selectedMetric = "injValveOpen"}
          />
        </Grid>

        {selectedMetric && <ChartContainer selectedMetric={selectedMetric} query={result.data} data={filterData(res.data, selectedMetric)} />}


      </Container>
    </Box>
  );
};

const DashBoardComp = (props) => {
  return (
    <Provider value={client}>
      <Dashboard {...props} />
    </Provider>
  );
};

export default DashBoardComp;

