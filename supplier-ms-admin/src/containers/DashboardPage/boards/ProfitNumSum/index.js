import Paper from '@material-ui/core/Paper';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Deposits from './Deposits';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    height: 'calc(100% - 32px)',
  },
}));

const ProfitNumSum = () => {
  const classes = useStyles();
  return (

      <Paper className={classes.paper}>
        <Deposits />
      </Paper>

  );
};

export default ProfitNumSum;