/* eslint-disable no-script-url */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";
import Title from "./Title";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function SalesOrderCountingCard({ salesOrders = [] }) {
  const classes = useStyles();
  const totalPrice = salesOrders.reduce((acc, cur) => acc + cur.grandTotal, 0);

  return (
    <React.Fragment>
      <Title>Sales Orders Count</Title>
      <Grid className={classes.depositContext}>
        <Typography color="textSecondary">Total price</Typography>
        <Typography component="p" variant="h4">
          <NumberFormat
            value={totalPrice}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />
        </Typography>
      </Grid>
      <Grid className={classes.depositContext}>
        <Typography color="textSecondary">Quantity</Typography>
        <Typography component="p" variant="h4">
          {salesOrders.length}
        </Typography>
      </Grid>
    </React.Fragment>
  );
}
