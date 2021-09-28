/**
 *
 * MonthlyReportPage
 *
 */

import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Chart from "./Chart";
import Orders from "./Orders";
import Card from "./Card";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 340,
  },
}));

export function AnnualReportPage() {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper className={classes.paper}>
          <Chart />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={classes.paper}>
          <Card />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Orders />
        </Paper>
      </Grid>
    </Grid>
  );
}

AnnualReportPage.propTypes = {};

export default AnnualReportPage;
