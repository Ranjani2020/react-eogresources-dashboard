import React from "react";
import { Provider, createClient, useQuery } from "urql";
import LinearProgress from "@material-ui/core/LinearProgress";

import Chart from "./Chart"

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const timeStampquery = `
query {
  heartBeat
}
`;

const ChartContainerComp = (props) => {
  return (
    <Provider value={client}>
      <ChartContainer {...props} />
    </Provider>
  );
}

const ChartContainer = (props) => {
  const [result] = useQuery({
    query: timeStampquery,
  });

  const { fetching, data, error } = result;

  if (fetching || error || !data) return <LinearProgress />;

  return (
    <Chart {...props} loadTimestamp={data.heartBeat} />
  );
};
export default ChartContainerComp;