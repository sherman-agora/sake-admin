/* eslint-disable no-script-url */

import { useQuery } from "@apollo/react-hooks";
import { DatePicker } from "@material-ui/pickers";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import Title from "../../Layout/Title";
import ProductAutocomplete from "../../../components/Inputs/ProductAutocomplete";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { Grid } from "@material-ui/core";

const GET_SO = gql`
  query deliveryNotes($where: DeliveryNoteWhereInput!) {
    deliveryNotes(where: $where) {
      salesOrder {
        products {
          quantity
          totalPrice
          product {
            code
          }
        }
      }
      items {
        product {
          code
          nameChi
        }
        item {
          label
          cost
        }
      }
    }
  }
`;
export default function FilterCard({
  setData,
  selectedDate,
  setSelectedDate,
  setProductCode,
}) {
  const [where, setWhere] = useState({
    createdAt_gt: selectedDate[0],
    createdAt_lt: selectedDate[1],
  });
  const { loading: fetching, data } = useQuery(GET_SO, {
    variables: {
      where: where,
      orderBy: "createdAt_DESC",
    },
  });

  useEffect(() => {
    if (data) {
      setData(data.deliveryNotes);
      console.log("data filter", data);
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

  const handleProductSelect = (product) => {
    setProductCode(product.code);
    setWhere({
      ...where,
      items_some: {
        productId: product.id,
      },
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
        </Grid>
        <Grid item>
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
          <h3>{"Select Product (Optional)"}</h3>
          <ProductAutocomplete onChange={handleProductSelect} />
        </Grid>
      </Grid>

      <Dialog aria-labelledby="simple-dialog-title" open={fetching}>
        <DialogTitle id="simple-dialog-title">Loading...</DialogTitle>
      </Dialog>
    </React.Fragment>
  );
}
