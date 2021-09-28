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

export default function ProductSalesDetail({ data = [], selectedDate, productCode }) {
  console.log('Delivery Note Product data', data)
  console.log('productcode', productCode)

  const from = dayjs(selectedDate[0]).format("DD/MM/YYYY");
  const to = dayjs(selectedDate[1]).format("DD/MM/YYYY");
  let generateRow = []

  const salesOrderItems = data.map((deliveryNote) => {
    const items = deliveryNote.salesOrder.products.map((item) => ({ code: item.product.code, totalPrice: item.totalPrice, quantity: item.quantity }));
    return items;
  })

  const convertSalesOrderItems = salesOrderItems.reduce((pre, curr) => {
    pre.push(...curr);
    return pre
  }, [])



  const mergedSalesOrderItemsPrice = convertSalesOrderItems.reduce((pre, curr) => {

    if (pre[curr.code] === undefined) {
      pre[curr.code] = curr;
      return pre;
    } else {
      pre[curr.code] = { ...curr, totalPrice: pre[curr.code].totalPrice + curr.totalPrice, quantity: pre[curr.code].quantity + curr.quantity }
      return pre;
    }
  }, {})



  const deliveryItems = data.map((deliveryNote) => {

    const items = deliveryNote.items.map((item) => ({ code: item.product.code, cost: item.item.cost, nameChi: item.product.nameChi }))
    return items;
  })



  const convertDeliveryItems = deliveryItems.reduce((pre, curr) => {
    pre.push(...curr)
    return pre;
  }, [])

  const mergedItems = convertDeliveryItems.reduce((pre, curr) => {
    if (pre[curr.code] === undefined) {
      pre[curr.code] = { cost: curr.cost, totalPrice: mergedSalesOrderItemsPrice[curr.code].totalPrice, nameChi: curr.nameChi, quantity: mergedSalesOrderItemsPrice[curr.code].quantity };
      return pre;
    } else {
      pre[curr.code] = { cost: curr.cost + pre[curr.code].cost, totalPrice: mergedSalesOrderItemsPrice[curr.code].totalPrice, nameChi: curr.nameChi, quantity: mergedSalesOrderItemsPrice[curr.code].quantity };
      return pre;
    }
  }, {})


  const generate = Object.entries(mergedItems).map(item => {
    const obj = {
      productCode: item[0],
      cost: item[1].cost,
      totalPrice: item[1].totalPrice,
      nameChi: item[1].nameChi,
      quantity: item[1].quantity
    }
    if (productCode != null && item[0] === productCode) {
      console.log('return here', item)
      generateRow.push(obj);
      return obj
    } else if (!productCode) {
      generateRow.push(obj)
      return obj
    } else {
      return null
    }
  })




  const options = {
    filename: `Product Sales Report ${from} ~ ${to}`,
    title: `Product Sales Report ${from} ~ ${to}`,
    useKeysAsHeaders: true,
    showTitle: true,
  };
  // CSV options
  const csvExporter = new ExportToCsv(options);
  const classes = useStyles();


  const handleClick = () => {
    csvExporter.generateCsv(generateRow);
  };

  return (
    <React.Fragment>
      <Title>ProductSales Detail</Title>
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
            <TableCell>Product Code</TableCell>
            <TableCell>Name Chi</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Total Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(generateRow).map((row) => (
            <TableRow key={row.productCode}>
              <TableCell>{row.productCode}</TableCell>
              <TableCell>{row.nameChi}</TableCell>
              <TableCell>{row.quantity}</TableCell>

              <TableCell>
                <NumberFormat
                  value={row.cost}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </TableCell>
              <TableCell>
                <NumberFormat
                  value={row.totalPrice}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                  decimalScale={1}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
