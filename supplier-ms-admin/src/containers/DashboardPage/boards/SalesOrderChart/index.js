import Paper from '@material-ui/core/Paper';
import Chart from './Chart';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    height: 'calc(100% - 32px)',
  },
}));

const SalesOrderChart = () => {
  const classes = useStyles();
  return (

      <Paper className={classes.paper}>
        <Chart />
      </Paper>
  );
}

export default SalesOrderChart;