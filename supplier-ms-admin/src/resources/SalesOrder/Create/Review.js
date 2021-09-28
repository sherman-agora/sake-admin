import React from "react";
import { Typography, TextField } from "@material-ui/core";
import dayjs from "dayjs";
import { NumberField, useTranslate } from "react-admin";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Grid from "@material-ui/core/Grid";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BilingualField from "../../../components/BilingualField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  label: {
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: theme.spacing(2),
  },
}));

function Review({ formData, setFormData }) {
  const translate = useTranslate();
  const classes = useStyles();
  let tempRemarks = "";
  console.log("formdata: ", formData);

  const handleSave = () => {
    setFormData({ ...formData, remark: tempRemarks });
  };

  const grandTotal = formData.products
    .reduce((results, product) => results + product.price * product.quantity, 0)
    .toFixed(2);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {translate("salesOrder.salesOrderDetails")}
      </Typography>
      <Grid container>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("salesOrder.code")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.code}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("salesOrder.customer")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.customer.nameChi}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("salesOrder.expectedDeliveryAt")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>
            {dayjs(formData.expectedDeliveryAt).format("YYYY-MM-DD") +
              "(YYYY-MM-DD)"}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            CustomerShop
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.customerShop.nameEn}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("salesOrder.state")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.state}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Table aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  Details
                </TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Product no.</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Total/(HK$)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.products &&
                formData.products.map((product) => {
                  const subTotal = (product.quantity * product.price).toFixed(
                    2
                  );
                  return (
                    <TableRow key={product.id}>
                      <TableCell align="center">{product.code}</TableCell>
                      <TableCell>
                        <BilingualField source="name" record={product} />
                      </TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        <NumberField
                          source="price"
                          record={product}
                          options={{ style: "currency", currency: "HKD" }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <NumberField
                          source="subTotal"
                          record={{ subTotal }}
                          options={{ style: "currency", currency: "HKD" }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell align="right">
                  <NumberField
                    source="grandTotal"
                    record={{ grandTotal }}
                    options={{ style: "currency", currency: "HKD" }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      <TextField
        label="Remarks"
        autoFocus={true}
        fullWidth
        multiline
        onChange={(event) => (tempRemarks = event.target.value)}
      />
      <div style={{ display: "flex" }}>
        <Button
          style={{ marginLeft: "auto", marginTop: 10 }}
          variant="contained"
          color="secondary"
          onClick={handleSave}
        >
          {!!formData.remark ? "Saved" : "Save Remark"}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default Review;
