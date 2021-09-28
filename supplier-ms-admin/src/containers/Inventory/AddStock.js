import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { SimpleForm, useTranslate, FormDataConsumer, useNotify, useGetOne, Loading } from "react-admin";
import { TextField, Grid, Button, makeStyles } from "@material-ui/core";
import { Save } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import WarehouseAutocomplete from "../../components/Inputs/WarehouseAutocomplete";
import PurchaseOrderAutocomplete from "../../components/Inputs/PurchaseOrderAutocomplete";
import sequentialNumber from "../../utils/sequentialNumber";
import gql from "graphql-tag";

const useStyle = makeStyles((theme) => ({
  autocomplete: {
    width: 500,
  },
  poAutocomplete: {
    width: 700,
  },
}));

export default function AddStock({ staticContext, ...props }) {
  const productId = props.match.params.productId;
  const initialValues = {
    stock: 0,
    purchaseOrder: null,
    warehouse: null,
    productId: productId,
    labelFrom: null,
    labelTo: null,
    expiryDate: "-",
    cost: 0,
  };
  const [formData, setFormData] = useState(initialValues);
  const dispatch = useDispatch();
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = () => "/Inventory";
  const INWAREHOUSE = gql`
    mutation inWarehouse($data: [InventoryItemCreateInput!]!) {
      inWarehouse(data: $data) {
        id
      }
    }
  `;
  const [inWarehouse] = useMutation(INWAREHOUSE);
  const Product = () => {
    const { data, loading, error } = useGetOne("Product", productId);
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <p>ERROR</p>;
    }
    return (
      <div>
        Product :<div>{data.nameChi}</div>
      </div>
    );
  };
  const handleOnPurchaseOrderChange = (purchaseOrder) => {
    setFormData({
      ...formData,
      purchaseOrder,
    });
  };
  const handleOnWarehouseChange = (warehouse) => {
    setFormData({
      ...formData,
      warehouse,
    });
  };
  const handleOnExpiryDateChange = (e) => {
    const expiryDate = e.target.value;
    setFormData({
      ...formData,
      expiryDate,
    });
  };
  const handleOnLabelFromChange = (e) => {
    const labelFrom = e.target.value.toUpperCase();
    var labelTo = null;
    if (labelFrom && labelFrom.length > 0) {
      labelTo = sequentialNumber.numberAfter(labelFrom, formData.stock);
    }
    setFormData({
      ...formData,
      labelFrom,
      labelTo,
    });
  };
  const handleOnLabelToChange = (e) => {
    const labelTo = e.target.value.toUpperCase();
    setFormData({
      ...formData,
      labelTo,
    });
  };

  const handleOnStockChange = (e) => {
    const stock = e.target.value;
    setFormData({
      ...formData,
      stock,
    });
  };
  const handleOnCostChange = (e) => {
    const cost = e.target.value;
    setFormData({
      ...formData,
      cost,
    });
  };
  const handleSave = () => {
    console.log(formData);
    const inventoryItemlist = [];
    var currentLabel = formData.labelFrom;
    for (let index = 0; index < formData.stock; index++) {
      const item = {
        productId: formData.productId,
        warehouse: { connect: { id: formData.warehouse.id } },
        purchaseOrderId: formData.purchaseOrder.id,
        expiryDate: formData.expiryDate,
        label: currentLabel,
      };
      currentLabel = sequentialNumber.numberAfter(currentLabel);
      inventoryItemlist.push(item);
    }
    inventoryItemlist.map((x) => console.log(x));
    inWarehouse({
      variables: {
        data: [...inventoryItemlist],
      },
    })
      .then((value) => {
        console.log("res", value);
        notify(`Save Success.`);
      })
      .catch((error) => {
        notify(`Error: ${error.message}`, "warning");
      });
  };
  const classes = useStyle();
  return (
    <React.Fragment>
      <SimpleForm
        toolbar={
          <Button color="primary" size="small" onClick={handleSave} style={{ marginTop: 20 }}>
            <Save />
            &nbsp;Save
          </Button>
        }
        redirect={redirect}
      >
        <Grid container style={{ height: 500 }} alignContent="space-around" alignItems="flex-start">
          <Product />
          <PurchaseOrderAutocomplete onChange={handleOnPurchaseOrderChange} defaultValue={formData.purchaseOrder} className={classes.poAutocomplete} />
          <WarehouseAutocomplete defaultValue={formData.warehouse} onChange={handleOnWarehouseChange} className={classes.autocomplete} />
          <TextField
            label={`ExpiryDate`}
            type="date"
            value={formData.expiryDate}
            variant="filled"
            onChange={handleOnExpiryDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label={`Stock`}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.stock}
            onChange={handleOnStockChange}
          />
          <TextField
            label={`${translate("product.label")} ${translate("common.from")}`}
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.labelFrom}
            onChange={handleOnLabelFromChange}
          />
          <TextField
            label={`${translate("product.label")} ${translate("common.to")}`}
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.labelTo}
            onChange={handleOnLabelToChange}
          />
          <TextField
            label={`Cost`}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.cost}
            onChange={handleOnCostChange}
          />
        </Grid>
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                { url: "/Inventory", label: "Inventory" },
                { url: `/Inventory/editStock/${productId}`, label: `Edit Stock` },
              ])
            );
            return null;
          }}
        </FormDataConsumer>
      </SimpleForm>
    </React.Fragment>
  );
}
