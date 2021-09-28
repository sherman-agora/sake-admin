/**
 *
 * MonthlyReportPage
 *
 */

import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { SalesOrderReport } from "./salesOrder";
import { SupplierReport } from "./SupplierReport/index";
import { Paper, Tab, Box, Typography, Tabs } from "@material-ui/core";
import { CustomerReport } from "./CustomerReport";
import { ProductSalesReport } from './productSalesReport'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function MonthlyReportPage() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {/* <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <SalesOrderReport />
      </TabPanel> */}

      <Paper>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Sales Order Report" />
          <Tab label="Supplier Report" />
          <Tab label="Customer Report" />
          <Tab label="Product Report" />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
        <SalesOrderReport />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SupplierReport />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CustomerReport />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ProductSalesReport />
      </TabPanel>
    </div>
  );
}

MonthlyReportPage.propTypes = {};

export default MonthlyReportPage;
