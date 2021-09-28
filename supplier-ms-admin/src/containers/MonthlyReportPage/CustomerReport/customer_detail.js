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

export default function CustomerDetail({ data = [], selectedDate }) {
  console.log("data: ", data);
  const from = dayjs(selectedDate[0]).format("DD/MM/YYYY");
  const to = dayjs(selectedDate[1]).format("DD/MM/YYYY");

  const customerOrders = data.reduce((pre, curr) => {
    if (pre[curr.shop.customer.id] === undefined) {
      pre[curr.shop.customer.id] = [curr];
      return pre;
    } else {
      pre[curr.shop.customer.id] = [...pre[curr.shop.customer.id], curr];
      return pre;
    }
  }, {});
  console.log("customerOrders", customerOrders);

  const generateRow = Object.values(customerOrders).map((orders, index) => {
    const customerInfo = orders[0].shop.customer;
    const products = orders.reduce((pre, curr) => {
      const items = curr.products.map((item) => {
        if (pre[item.product.code] === undefined) {
          pre[item.product.code] = { code: item.product.code, quantity: item.quantity }
        } else {
          pre[item.product.code] = { code: item.product.code, quantity: pre[item.product.code].quantity + item.quantity }
        }
      })
      return pre
    }, {})
    console.log('products', products)
    const convertProductsToText = Object.values(products).map(item => `${item.code}: ${item.quantity}`)
    const totalAmount = orders.reduce((pre, curr) => {
      pre += curr.grandTotal;
      return pre;
    }, 0);
    return {
      customerNo: customerInfo.code,
      nameEn: customerInfo.nameEn,
      nameChi: customerInfo.nameChi,
      mobile: customerInfo.mobile,
      email: customerInfo.email,
      billAddress: customerInfo.billingAddress,
      wholesalePlan: `Plan ${customerInfo.wholesalePlan}`,
      paymentMethod: customerInfo.paymentMethod,
      orderTimes: orders.length,
      orderAmount: totalAmount,
      avgAmount: totalAmount / orders.length,
      products: convertProductsToText
    };
  });

  const options = {
    filename: `Customer Sales Report ${from} ~ ${to}`,
    title: `Customer Sales Report ${from} ~ ${to}`,
    useKeysAsHeaders: true,
    showTitle: true,
  };
  // CSV options
  const csvExporter = new ExportToCsv(options);
  const classes = useStyles();

  const calculateAvgOrderAmount = (row) => {
    return parseInt(row.totalOrderAmount) / parseInt(row.orderTimes);
  };

  // const tempReport = Object.values(mergeSameSupplier).map((d) => {
  //   return {
  //     name: d.nameEn,
  //     country: d.country,
  //     phone: d.phone,
  //     fax: d.fax,
  //     paymentTerms: d.paymentTerms,
  //     creditLine: d.creditLine,
  //     orderTimes: d.orderTimes,
  //     totalOrderAmount: d.totalOrderAmount,
  //     avgOrderAmount: calculateAvgOrderAmount(d),
  //     lastOrderDate: new Date(d.lastOrderDate).toLocaleDateString("zh"),
  //   };
  // });
  // CSV map
  const handleClick = () => {
    csvExporter.generateCsv(generateRow);
  };

  return (
    <React.Fragment>
      <Title>Customer Detail</Title>
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
            <TableCell>CustomerNo.</TableCell>
            <TableCell>Name En</TableCell>
            <TableCell>Name Chi</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Order times</TableCell>
            <TableCell>Total Order amount</TableCell>
            <TableCell>Avg Order amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(generateRow).map((row) => (
            <TableRow key={row.customerNo}>
              <TableCell>{row.customerNo}</TableCell>
              <TableCell>{row.nameEn}</TableCell>
              <TableCell>{row.nameChi}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.orderTimes}</TableCell>
              <TableCell>{row.orderAmount}</TableCell>
              {/* <TableCell>{row.avgAmount}</TableCell> */}
              {/* <TableCell>
                {new Date(row.lastOrderDate).toLocaleDateString("zh")}
              </TableCell> */}

              <TableCell>
                <NumberFormat
                  value={row.avgAmount}
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
