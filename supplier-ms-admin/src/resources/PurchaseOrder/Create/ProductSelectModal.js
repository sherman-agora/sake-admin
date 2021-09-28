import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-admin';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

function ProductSelectModal({ onSubmit, onCancel, product, open: openProp }) {
  const translate = useTranslate();
  const [open, setOpen] = useState(openProp);
  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  const [formData, setFormData] = useState({product});
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        quantity: parseInt(product.minOrderQuantity, 10),
        price: parseFloat(product.cost),
      });
    }
  }, [product]);

  const handleClose = () => {
    onCancel();
    setOpen(false);
  };

  const handleSave = () => {
    onSubmit(formData);
    handleClose();
  };

  const handleDiscount = (discount) => () => {
    setFormData({...formData, price: (parseFloat(formData.price) * discount).toFixed(2)});
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{translate('purchaseOrder.editPurchaseOrder')}</DialogTitle>
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
                id="quantity"
                label={translate('product.quantity')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.currentTarget.value, 10) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="price"
                label={translate('product.price')}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="filled"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.currentTarget.value).toFixed(2) })}
              />
              <ButtonGroup>
                <Button onClick={handleDiscount(0.95)}>5% off</Button>
                <Button onClick={handleDiscount(0.9)}>10% off</Button>
                <Button onClick={handleDiscount(0.85)}>15% off</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {translate('common.cancel')}
        </Button>
        <Button onClick={handleSave} color="primary">
          {translate('common.save')}
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
