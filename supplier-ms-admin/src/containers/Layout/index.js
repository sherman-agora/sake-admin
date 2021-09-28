import React, { useEffect, useState } from "react";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { WorkflowColors } from "@tsunadon/supplier-ms-react-workflow";
import { useSelector, useDispatch } from "react-redux";
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { Notification, setSidebarVisibility } from "react-admin";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";
import Workflow from "./Workflow";
import Breadcrumb from "../../components/Breadcrumb";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
    position: "relative",
    minWidth: "fit-content",
    width: "100%",
  },
  appFrame: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("xs")]: {
      marginTop: theme.spacing(6),
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: theme.spacing(7),
    },
  },
  contentWithSidebar: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexBasis: 0,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

const Layout = ({ children, dashboard, logout, title, theme }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  // const location = useLocation();
  // const [theme, setTheme] = useState(defaultTheme);
  // useEffect(() => {
  //   const paths = location.pathname.split('/');
  //   const mainColor = (paths.length > 1 && WorkflowColors[pluralize.singular(paths[1])]) || '#f16112';
  //   const newTheme = createMuiTheme({
  //     palette: {
  //       primary: {
  //         main: mainColor,
  //       },
  //     },
  //     sidebar: {
  //       width: '100%', // The default value is 240
  //       closedWidth: '100%', // The default value is 55
  //     },
  //   });
  //
  //   setTheme(newTheme);
  // }, [location, setTheme]);

  useEffect(() => {
    dispatch(setSidebarVisibility(true));
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar open={open} logout={logout} />
          <main className={classes.contentWithSidebar}>
            <Workflow logout={logout} hasDashboard={!!dashboard} />
            <Breadcrumb />
            <div className={classes.content}>{children}</div>
          </main>
          <Notification />
        </div>
      </div>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dashboard: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  title: PropTypes.string.isRequired,
};

export default Layout;
