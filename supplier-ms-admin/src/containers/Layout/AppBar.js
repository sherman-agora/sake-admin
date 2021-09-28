// in src/MyAppBar.js
import React, { useState } from "react";
import classNames from "classnames";
import {
  useTranslate,
  HideOnScroll,
  MenuItemLink,
  toggleSidebar,
} from "react-admin";
import Typography from "@material-ui/core/Typography";
import {
  makeStyles,
  AppBar as MuiAppBar,
  useMediaQuery,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Settings from "@material-ui/icons/Settings";
import Dns from "@material-ui/icons/Dns";
import Menu from "@material-ui/core/Menu";
import { useDispatch } from "react-redux";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import HouseIcon from "@material-ui/icons/House";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import GroupIcon from "@material-ui/icons/Group";
import Store from "@material-ui/icons/Store";
import MenuIcon from "@material-ui/icons/Menu";
import Business from "@material-ui/icons/Business";
import { AccountCircle, LocationCity, Storefront } from "@material-ui/icons";
import { Link } from "react-router-dom";

const useStyles = makeStyles(
  (theme) => ({
    toolbar: {
      paddingRight: theme.spacing(3),
      backgroundColor: theme.palette.primary.main,
      transition: theme.transitions.create(["background-color"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    menuButton: {
      marginLeft: "0.5em",
      marginRight: "0.5em",
    },
    menuButtonIconClosed: {
      transition: theme.transitions.create(["transform"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      transform: "rotate(0deg)",
    },
    menuButtonIconOpen: {
      transition: theme.transitions.create(["transform"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      transform: "rotate(180deg)",
    },
    title: {
      flex: 1,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  }),
  { name: "RaAppBar" }
);

const xeroStyle = {
  color: "white",
};

const MyAppBar = ({
  children,
  classes: classesOverride,
  className,
  logo,
  logout,
  open,
  title,
  userMenu,
  ...rest
}) => {
  const translate = useTranslate();
  const dispatch = useDispatch();
  const classes = useStyles({ classes: classesOverride });
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [settingsMenu, setSettingsMenu] = useState(null);
  const [uMenu, setUserMenu] = useState(null);

  const handleSettingsClick = (event) => {
    setSettingsMenu(event.currentTarget);
  };
  const handleSettingsClose = (event) => {
    setSettingsMenu(null);
  };
  const handleUserClick = (event) => {
    setUserMenu(event.currentTarget);
  };
  const handleUserClose = (event) => {
    setUserMenu(null);
  };

  return (
    <HideOnScroll>
      <MuiAppBar className={className} color="primary" {...rest}>
        <Toolbar
          disableGutters
          variant={isXSmall ? "regular" : "dense"}
          className={classes.toolbar}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch(toggleSidebar())}
            className={classNames(classes.menuButton)}
          >
            <MenuIcon
              classes={{
                root: open
                  ? classes.menuButtonIconOpen
                  : classes.menuButtonIconClosed,
              }}
            />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {translate("softwareName")}
          </Typography>
          <Link to="/xero" style={xeroStyle}>
            <IconButton color="inherit">
              <Dns />
            </IconButton>
          </Link>
          <IconButton
            aria-label="Settings"
            aria-controls="long-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleSettingsClick}
          >
            <Settings />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={settingsMenu}
            keepMounted
            open={Boolean(settingsMenu)}
            onClose={handleSettingsClose}
          >
            <MenuItemLink
              to="/Product"
              primaryText={translate("menu.item.product")}
              leftIcon={<AllInboxIcon />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/Supplier"
              primaryText={translate("menu.item.supplier")}
              leftIcon={<LocationCity />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/Customer"
              primaryText={translate("menu.item.customer")}
              leftIcon={<Storefront />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/Warehouse"
              primaryText={translate("menu.item.warehouse")}
              leftIcon={<HouseIcon />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/ProductCategory"
              primaryText={translate("menu.item.productCategory")}
              leftIcon={<GroupWorkIcon />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/CustomerGroup"
              primaryText={translate("menu.item.customerGroup")}
              leftIcon={<GroupIcon />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/CustomerShop"
              primaryText={translate("menu.item.customerShop")}
              leftIcon={<Store />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/User"
              primaryText={translate("menu.item.user")}
              leftIcon={<GroupIcon />}
              onClick={handleSettingsClose}
            />
            <MenuItemLink
              to="/UserGroup"
              primaryText={translate("menu.item.userGroup")}
              leftIcon={<Business />}
              onClick={handleSettingsClose}
            />
          </Menu>
          <IconButton
            aria-label="Warren Chan"
            aria-controls="long-menu"
            aria-haspopup="true"
            color="inherit"
            onClick={handleUserClick}
          >
            <AccountCircle />
            &nbsp;
            <Typography>{localStorage.getItem("userName")}</Typography>
          </IconButton>
          <Menu
            id="user-menu"
            anchorEl={uMenu}
            keepMounted
            open={Boolean(uMenu)}
            onClose={handleUserClose}
          >
            {logout}
          </Menu>
        </Toolbar>
      </MuiAppBar>
    </HideOnScroll>
  );
};

export default MyAppBar;
