/* eslint-disable no-script-url */

import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@material-ui/core";
import Title from "./Title";
import { DatePicker } from "@material-ui/pickers";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import dayjs from "dayjs";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const GET_SALES_ORDERS = gql`
  query salesOrders($where: SalesOrderWhereInput) {
    salesOrders(where: $where, orderBy: updatedAt_DESC) {
      id
      code
      shop {
        id
        code
        nameEn
        nameChi
        deliveryDay
        customer {
          id
          nameEn
          nameChi
        }
      }
      grandTotal
      state
    }
  }
`;
export default function FilterCard({
  setSalesOrders,
  selectedDate,
  setSelectedDate,
}) {
  const [status, setStatus] = useState(null);
  const [where, setWhere] = useState({
    actualDate_gt: selectedDate[0],
    actualDate_lt: selectedDate[1],
  });
  const { loading: fetching, data } = useQuery(GET_SALES_ORDERS, {
    variables: {
      where: where,
      orderBy: "updatedAt_DESC",
    },
  });
  const stateList = [
    "ALL",
    "RECEIVED",
    "CONFIRMED",
    "INVOICED",
    "PACKED",
    "DELIVERED",
    "PAID",
    "DELETED",
  ];

  useEffect(() => {
    if (data) {
      setSalesOrders(data.salesOrders);
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

  const handleClick = (event) => {
    setStatus(event.target.value);
    setWhere({ ...where, state: event.target.value });
    if (event.target.value === "ALL") {
      setWhere({
        actualDate_gt: selectedDate[0],
        actualDate_lt: selectedDate[1],
      });
    }
  };

  return (
    <React.Fragment>
      <Title>Select Date</Title>
      <div/>
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

      <FormControl>
        <InputLabel id="demo-simple-select-label">
          Select Sales Order Status
        </InputLabel>

        <Select
          label="Select Sales Order Status"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          onChange={handleClick}
        >
          {stateList.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Dialog aria-labelledby="simple-dialog-title" open={fetching}>
      <DialogTitle id="simple-dialog-title">Loading...</DialogTitle>
      </Dialog>
    </React.Fragment>
  );
}
