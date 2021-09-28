import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  label: {
    padding: theme.spacing(1),
    paddingBottom: 0,
    color: theme.palette.text.hint,
  },
  text: {
    padding: theme.spacing(1),
    paddingTop: 0,
    color: theme.palette.text.primary,
  }
}));

function ShowText({ label, children }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.label}>
        <Typography variant="caption">{label}</Typography>
      </div>
      <div className={classes.text}>
        <Typography variant="inherit">{children}</Typography>
      </div>
    </React.Fragment>
  );
}

ShowText.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ShowText;