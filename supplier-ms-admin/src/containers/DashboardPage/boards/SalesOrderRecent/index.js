import Paper from '@material-ui/core/Paper';
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Orders from './Orders';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    height: 'calc(100% - 32px)',
  },
}));

const SalesOrderRecent = () => {
  const classes = useStyles();
  return (

      <Paper className={classes.paper}>
        <Orders />
      </Paper>

  );
};

export default SalesOrderRecent;