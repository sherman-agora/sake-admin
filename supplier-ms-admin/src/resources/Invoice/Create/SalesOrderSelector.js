import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { useTranslate, NumberField } from "react-admin";
import SalesOrderAutocomplete from "../../../components/Inputs/SalesOrderAutocomplete";
import ShowText from "../../../components/Shows/ShowText";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import BilingualField from "../../../components/BilingualField";

function SalesOrderSelector({ formData, setFormData }) {
  const translate = useTranslate();

  const handleSelect = (salesOrder) => {
    setFormData({
      ...formData,
      salesOrderCode: salesOrder.code,
      salesOrderId: salesOrder.id,
      totalPrice: salesOrder.grandTotal,
      contactPerson: salesOrder.contactPerson,
      customerShop: salesOrder.shop,
      salesOrder,
    });
  };

  const renderSalesOrderDetails = () => {
    const { salesOrder } = formData;
    const { products } = salesOrder;
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6}>
          <ShowText label="Shop">{salesOrder.shop.code}</ShowText>
          <ShowText label={translate("salesOrder.customer")}>
            {salesOrder.shop.customer.nameChi}
          </ShowText>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate("salesOrder.totalPrice")}>
            <NumberField
              source="totalPrice"
              record={salesOrder}
              options={{ style: "currency", currency: "HKD" }}
            />
          </ShowText>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate("salesOrder.state")}>
            {salesOrder.state}
          </ShowText>
        </Grid>
        <Grid item xs={12}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{translate("product.code")}</TableCell>
                <TableCell>{translate("product.name")}</TableCell>
                <TableCell align="right">
                  {translate("shipping.quantityCheck")}
                </TableCell>
                <TableCell align="right">
                  {translate("shipping.status")}
                </TableCell>
                <TableCell align="right">
                  {translate("invoice.totalPrice")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((row, i) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.product.code}</TableCell>
                    <TableCell component="th" scope="row">
                      <BilingualField source="name" record={row.product} />
                    </TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">
                      <NumberField
                        source="price"
                        record={row}
                        options={{ style: "currency", currency: "HKD" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <NumberField
                        source="totalPrice"
                        record={row}
                        options={{ style: "currency", currency: "HKD" }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <SalesOrderAutocomplete
          where={{ variables: { where: { state: "CONFIRMED" } } }}
          onChange={handleSelect}
          defaultValue={formData.salesOrder}
        />
      </Grid>
      {formData.salesOrder && renderSalesOrderDetails()}
    </Grid>
  );
}

SalesOrderSelector.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default SalesOrderSelector;
