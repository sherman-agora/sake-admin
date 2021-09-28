/* eslint-disable no-script-url */

import { useQuery } from "@apollo/react-hooks";
import { DatePicker } from "@material-ui/pickers";
import gql from "graphql-tag";
import { set } from "lodash";
import React, { useEffect, useState } from "react";
import CustomerAutocomplete from "../../../components/Inputs/CustomerAutocomplete";
import Title from "../../Layout/Title";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { Grid } from "@material-ui/core";

const GET_SO = gql`
  query salesOrders($where: SalesOrderWhereInput!) {
    salesOrders(where: $where) {
      grandTotal
      products {
        quantity
        product {
          code
        }
      }
      shop {
        code
        customer {
          id
          code
          nameEn
          nameChi
          wholesalePlan
          mobile
          email
          paymentMethod
          billingAddress
        }
      }
    }
  }
`;
export default function FilterCard({ setData, selectedDate, setSelectedDate }) {
  const [where, setWhere] = useState({
    actualDate_gt: selectedDate[0],
    actualDate_lt: selectedDate[1],
  });
  const { loading: fetching, data } = useQuery(GET_SO, {
    variables: {
      where: where,
      orderBy: "createdAt_DESC",
    },
  });

  useEffect(() => {
    if (data) {
      setData(data.salesOrders);
      console.log("data filter", data);
    }
  }, [data]);

  const handleFromDateChange = (date) => {
    setSelectedDate([date.toISOString(), selectedDate[1]]);
    setWhere({
      ...where,
      actualDate_gt: date.toISOString(),
      actualDate_lt: selectedDate[1],
    });
  };

  const handleToDateChange = (date) => {
    setSelectedDate([selectedDate[0], date.toISOString()]);
    setWhere({
      ...where,
      actualDate_gt: selectedDate[0],
      actualDate_lt: date.toISOString(),
    });
  };

  const handleSelectCustomer = (customer) => {
    console.log("customer.shopIds", customer);
    setWhere({
      ...where,
      shopId_in: customer.shops.map((shop) => shop.id),
    });
  };

  return (
    <React.Fragment>
      <Grid container direction="column">
        <Grid item>
          <Title>Select Date</Title>
        </Grid>
        <Grid item>
          <DatePicker
            format="DD MMM YYYY"
            views={["year", "month", "date"]}
            inputVariant="filled"
            fullWidth
            variant="inline"
            value={selectedDate[0]}
            label="Filter From: "
            onChange={handleFromDateChange}
          />
        </Grid>
        <Grid item>
          <h2>-To-</h2>
          <DatePicker
            minDate={selectedDate[0]}
            format="DD MMM YYYY"
            views={["year", "month", "date"]}
            inputVariant="filled"
            fullWidth
            variant="inline"
            value={selectedDate[1]}
            label="Filter To: "
            onChange={handleToDateChange}
          />
        </Grid>
        <Grid item>
          <h2>{"Select customer (Optional)"}</h2>
          <CustomerAutocomplete onChange={handleSelectCustomer} />
        </Grid>
      </Grid>
      <Dialog aria-labelledby="simple-dialog-title" open={fetching}>
        <DialogTitle id="simple-dialog-title">Loading...</DialogTitle>
      </Dialog>
    </React.Fragment>
  );
}
