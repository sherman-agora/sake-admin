import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

function ProductSelectModal({
  onSubmit,
  onCancel,
  product,
  open: openProp,
  customer,
}) {
  const translate = useTranslate();
  const [open, setOpen] = useState(openProp);
  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  const [formData, setFormData] = useState({ product });

  let wholeSalePriceList = [
    formData.wholeSalePrice1,
    formData.wholeSalePrice2,
    formData.wholeSalePrice3,
    formData.wholeSalePrice4,
    formData.wholeSalePrice5,
  ];
  if (product && product.discount && wholeSalePriceList.length > 0) {
    if (product.discount.includes("%")) {
      const percent = 1 - parseFloat(product.discount) / 100;
      console.log("percent", percent)

      wholeSalePriceList = wholeSalePriceList.map((price) => parseFloat(price) * percent);
      console.log(wholeSalePriceList)
    } else if (product.discount.includes("HKD")) {
      const discountAmount = parseFloat(product.discount.replace("HKD", ""));
      wholeSalePriceList = wholeSalePriceList.map(
        (price) => price - discountAmount
      );
    }
  }
  console.log(wholeSalePriceList)

  useEffect(() => {
    if (product && customer) {
      let productWholeSalesPriceList = [
        product.wholeSalePrice1,
        product.wholeSalePrice2,
        product.wholeSalePrice3,
        product.wholeSalePrice4,
        product.wholeSalePrice5,
      ];
      if (
        product &&
        product.discount &&
        productWholeSalesPriceList.length > 0
      ) {
        if (product.discount.includes("%")) {
          const percent = 1 - parseFloat(product.discount) / 100;

          productWholeSalesPriceList = productWholeSalesPriceList.map(
            (price) => price * percent
          );
          wholeSalePriceList = productWholeSalesPriceList
        } else if (product.discount.includes("HKD")) {
          const discountAmount = parseFloat(
            product.discount.replace("HKD", "")
          );
          productWholeSalesPriceList = productWholeSalesPriceList.map(
            (price) => price - discountAmount
          );
          productWholeSalesPriceList = productWholeSalesPriceList
        }
      }

      setFormData({
        ...product,
        quantity: 1,
        price: parseFloat(
          productWholeSalesPriceList[customer.wholesalePlan - 1]
        ),
      });
    }
  }, [product]);

  const [selectBtn, setSelectBtn] = useState(customer.wholesalePlan);

  const handleClose = () => {
    onCancel();
    setOpen(false);
  };

  const handleSave = () => {
    setFormData({ ...formData, price: parseFloat(formData.price).toFixed(2) });
    onSubmit(formData);
    handleClose();
  };

  const handleWholeSalePrice = (price, index) => () => {
    console.log(`index is :${index} + price is : ${price}`)
    setSelectBtn(index + 1);
    console.log(`index is :${index} + price is : ${price}`)
    setFormData({ ...formData, price: price });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {translate("salesOrder.editSalesOrder")}
      </DialogTitle>
      <DialogContent>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {product && product.code}
            </Grid>
            <Grid item xs={12}>
              {product && product.nameChi}
            </Grid>
            <Grid item xs={12}>
              {product && product.nameEn}
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={product && formData.quantity > product.quantity}
                helperText={
                  product && formData.quantity > product.quantity
                    ? "Over Order"
                    : ""
                }
                id="quantity"
                label={translate("product.quantity")}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant={
                  product && formData.quantity > product.quantity
                    ? "outlined"
                    : "filled"
                }
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.currentTarget.value, 10),
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="price"
                label={translate("product.price")}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.currentTarget.value })
                }
              />
              <ButtonGroup>
                {wholeSalePriceList.map((price, index) => (
                  <Button
                    onClick={handleWholeSalePrice(price, index)}
                    color={selectBtn == index + 1 ? "secondary" : undefined}
                    variant="contained"
                  >
                    {translate("product.wholeSalePrice")}
                    {index + 1}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {translate("common.cancel")}
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={
            product && formData.quantity && formData.quantity > product.quantity
          }
        >
          {translate("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProductSelectModal.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  product: PropTypes.object,
  open: PropTypes.bool.isRequired,
};

export default ProductSelectModal;
