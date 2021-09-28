/* eslint-disable no-script-url */

import { useQuery } from "@apollo/react-hooks";
import { DatePicker } from "@material-ui/pickers";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import Title from "../../Layout/Title";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const GET_PO = gql`
  query purchaseOrders($where: PurchaseOrderWhereInput!) {
    purchaseOrders(where: $where) {
      id
      code
      supplier {
        id
        name
        country
        phone
        fax
        paymentTerms
        creditLine
      }
      totalPrice
      createdAt
    }
  }
`;
export default function FilterCard({ setData, selectedDate, setSelectedDate }) {
  const [where, setWhere] = useState({
    createdAt_gt: selectedDate[0],
    createdAt_lt: selectedDate[1],
  });
  const { loading: fetching, data } = useQuery(GET_PO, {
    variables: {
      where: where,
      orderBy: "createdAt_DESC",
    },
  });

  useEffect(() => {
    if (data) {
      setData(data.purchaseOrders);
    }
  }, [data]);

  const handleFromDateChange = (date) => {
    setSelectedDate([date.toISOString(), selectedDate[1]]);
    setWhere({
      ...where,
      createdAt_gt: date.toISOString(),
      createdAt_lt: selectedDate[1],
    });
  };

  const handleToDateChange = (date) => {
    setSelectedDate([selectedDate[0], date.toISOString()]);
    setWhere({
      ...where,
      createdAt_gt: selectedDate[0],
      createdAt_lt: date.toISOString(),
    });
  };

  return (
    <React.Fragment>
      <Title>Select Date</Title>
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
      <Dialog aria-labelledby="simple-dialog-title" open={fetching}>
      <DialogTitle id="simple-dialog-title">Loading...</DialogTitle>
      </Dialog>
    </React.Fragment>
  );
}
