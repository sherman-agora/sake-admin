import React from 'react';
import { Sidebar as AdminSidebar } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: 0,
    transition: theme.transitions.create('height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }
}));

const Sidebar = props => {
  const classes = useStyles();
  return (
    <AdminSidebar {...props} classes={classes} size={200} />
  );
}

export default Sidebar;
