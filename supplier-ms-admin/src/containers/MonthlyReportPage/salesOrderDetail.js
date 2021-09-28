/* eslint-disable no-script-url */

import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CallMissedOutgoingIcon from "@material-ui/icons/CallMissedOutgoing";
import dayjs from "dayjs";
import { ExportToCsv } from "export-to-csv";
import React from "react";
import NumberFormat from "react-number-format";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function SalesOrdersDetail({ salesOrders = [], selectedDate }) {
  const form = dayjs(selectedDate[0]).format("DD/MM/YYYY");
  const to = dayjs(selectedDate[1]).format("DD/MM/YYYY");

  const options = {
    filename: `Sales Order Report ${form} ~ ${to}`,
    title: `Sales Order Report ${form} ~ ${to}`,
    useKeysAsHeaders: true,
    showTitle: true,
  };
  const csvExporter = new ExportToCsv(options);
  const classes = useStyles();
  const tempSO = salesOrders.map((so) => {
    return {
      SalesOrderNumber: so.code,
      CustomerName: so.shop.customer.nameEn,
      CustomerShop: so.shop.nameEn,
      Status: so.state,
      GrandTotal: so.grandTotal,
    };
  });
  const handleClick = () => {
    csvExporter.generateCsv(tempSO);
  };

  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CallMissedOutgoingIcon />}
          onClick={handleClick}
        >
          Export
        </Button>
      </Grid>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sales Order Number</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Customer Shop</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Grand total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesOrders.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.code}</TableCell>
              <TableCell>{row.shop.customer.nameEn}</TableCell>
              <TableCell>{row.shop.nameEn}</TableCell>
              <TableCell>{row.state}</TableCell>
              <TableCell align="right">
                <NumberFormat
                  value={row.grandTotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
