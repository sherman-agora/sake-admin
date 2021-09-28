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
import Title from "../../Layout/Title";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function SupplierDetail({ data = [], selectedDate }) {
  const from = dayjs(selectedDate[0]).format("DD/MM/YYYY");
  const to = dayjs(selectedDate[1]).format("DD/MM/YYYY");
  const mergeSameSupplier = data.reduce((pre, curr) => {
    if (!pre[curr.supplier.id]) {
      pre[curr.supplier.id] = {
        id: curr.id,
        supplierId: curr.supplier.id,
        nameEn: curr.supplier.name,
        phone: curr.supplier.phone,
        country: curr.supplier.country,
        fax: curr.supplier.fax,
        paymentTerms: curr.supplier.paymentTerms,
        creditLine: curr.supplier.creditLine,
        orderTimes: 1,
        totalOrderAmount: curr.totalPrice,
        lastOrderDate: curr.createdAt,
      };
      return pre;
    } else {
      pre[curr.supplier.id] = {
        ...pre[curr.supplier.id],
        orderTimes: pre[curr.supplier.id].orderTimes + 1,
        totalOrderAmount:
          pre[curr.supplier.id].totalOrderAmount + curr.totalPrice,
        lastOrderDate:
          pre[curr.supplier.id].lastOrderDate < curr.createdAt
            ? curr.createdAt
            : pre[curr.supplier.id].lastOrderDate,
      };
      return pre;
    }
  }, {});

  const options = {
    filename: `Supplier Report ${from} ~ ${to}`,
    title: `Supplier Report ${from} ~ ${to}`,
    useKeysAsHeaders: true,
    showTitle: true,
  };
  // CSV options
  const csvExporter = new ExportToCsv(options);
  const classes = useStyles();

  const calculateAvgOrderAmount = (row) => {
    return parseInt(row.totalOrderAmount) / parseInt(row.orderTimes);
  };

  const tempReport = Object.values(mergeSameSupplier).map((d) => {
    return {
      name: d.nameEn,
      country: d.country,
      phone: d.phone,
      fax: d.fax,
      paymentTerms: d.paymentTerms,
      creditLine: d.creditLine,
      orderTimes: d.orderTimes,
      totalOrderAmount: d.totalOrderAmount,
      avgOrderAmount: calculateAvgOrderAmount(d),
      lastOrderDate: new Date(d.lastOrderDate).toLocaleDateString("zh"),
    };
  });
  // CSV map
  const handleClick = () => {
    csvExporter.generateCsv(tempReport);
  };

  return (
    <React.Fragment>
      <Title>Supplier Detail</Title>
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
            <TableCell>Name en</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Order times</TableCell>
            <TableCell>Total Order amount</TableCell>
            <TableCell>Avg Order amount</TableCell>
            <TableCell>Last order date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(mergeSameSupplier).map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.nameEn}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.country}</TableCell>
              <TableCell>{row.orderTimes}</TableCell>
              <TableCell>{row.totalOrderAmount}</TableCell>
              <TableCell>{calculateAvgOrderAmount(row)}</TableCell>
              <TableCell>
                {new Date(row.lastOrderDate).toLocaleDateString("zh")}
              </TableCell>

              {/* <TableCell align="right">
                <NumberFormat
                  value={row.grandTotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
