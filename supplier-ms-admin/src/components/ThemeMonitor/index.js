import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { WorkflowColors } from "@tsunadon/supplier-ms-react-workflow";
import pluralize from "pluralize";
import { createMuiTheme } from "@material-ui/core/styles";

function ThemeMonitor({ onChangeTheme }) {
  const location = useLocation();
  useEffect(() => {
    const paths = location.pathname.split("/");
    const mainColor =
      (paths.length > 1 && WorkflowColors[pluralize.singular(paths[1])]) ||
      "#f16112";
    const newTheme = createMuiTheme({
      palette: {
        primary: {
          main: mainColor,
        },
      },
      sidebar: {
        width: "100%", // The default value is 240
        closedWidth: "100%", // The default value is 55
      },
    });

    onChangeTheme(newTheme);
  }, [location, onChangeTheme]);
  return null;
}

ThemeMonitor.propTypes = {
  onChangeTheme: PropTypes.func.isRequired,
};

export default ThemeMonitor;
