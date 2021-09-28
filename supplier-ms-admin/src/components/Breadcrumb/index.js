import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { Breadcrumbs as MuiBreadcrumbs } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  breadcrumb: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const Breadcrumb = () => {
  const breadcrumbs = useSelector(state => state.breadcrumb);
  const classes = useStyles();

  const links = [...breadcrumbs];
  let last = links.pop();

  const linkStyle = {
    textDecoration: 'none',
    color: '#666',
    hover: {
      textDecoration: 'underline',
    },
  };

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
      {links.map(bc => (
        <Link key={`linkTo${bc.url}`} to={bc.url} style={linkStyle}>
          {bc.label}
        </Link>
      ))}
      {last && (
        <Typography color="textPrimary">{last.label}</Typography>
      )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumb;
