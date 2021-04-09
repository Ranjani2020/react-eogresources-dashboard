import React from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "moment"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const useStyles = makeStyles({
  card: {
    marginTop: "1rem"
  }
});

const metricLabelMap = {
  tubingPressure: "Tubing Pressure",
  casingPressure: "Casing Pressure",
  oilTemp: "Oil Temp",
  flareTemp: "Flare Temp",
  waterTemp: "Water Temp",
  injValveOpen: "injValve Open",
}

const Chart = (props) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader title={`Graph Visualization( ${metricLabelMap[props.selectedMetric]} )`} />
      <CardContent align={"center"}>
        <LineChart
          width={800}
          height={400}
          data={props.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey={(v) => Moment(v.at).format("H:mm")} />
          <YAxis unit={props.data[0].unit} type="number" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line name={props.data[0].metric} unit={props.data[0].unit} type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </CardContent>
    </Card>
  );
};
export default Chart;