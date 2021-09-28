import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
  },
}));

export default function Title(props) {
  const classes = useStyles();
  return (
    <Typography component="h1" variant="h4" color="primary" noWrap className={classes.title}>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};
