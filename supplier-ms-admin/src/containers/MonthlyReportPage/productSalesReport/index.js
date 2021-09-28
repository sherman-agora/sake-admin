import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useState } from "react";
import Title from "../../Layout/Title";
import FilterCard from "./filter";
import ProductSalesDetail from "./productSalesDetail";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(16),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 340,
  },
}));

export function ProductSalesReport() {
  const classes = useStyles();
  const [data, setData] = useState();
  const [selectedDate, setSelectedDate] = useState([new Date(), new Date()]);
  const [productCode, setProductCode] = useState(null);
  console.log("selectedDate", selectedDate);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Title>ProductSales Report</Title>
      </Grid>

      {/* Filter Date Card */}
      <Grid item xs={6} md={4} lg={3}>
        <Paper className={classes.paper}>
          <FilterCard
            setData={setData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setProductCode={setProductCode}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <ProductSalesDetail data={data} selectedDate={selectedDate} productCode={productCode} />
        </Paper>
      </Grid>
    </Grid>
  );
}
