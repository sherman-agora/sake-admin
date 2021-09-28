import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { NumberField, useTranslate } from 'react-admin';
import PurchaseOrderAutocomplete from '../../../components/Inputs/PurchaseOrderAutocomplete';
import ShowText from '../../../components/Shows/ShowText';
import dayjs from 'dayjs';

function PurchaseOrderSelector({ formData, setFormData }) {
  const translate = useTranslate();

  const handleSelect = (purchaseOrder) => {
    purchaseOrder.products.forEach((p) => {
      p.exactQuantity = 0;
      p.totalPrice = 0;
    });

    setFormData({
      ...formData,
      purchaseOrder,
    });
  };

  const renderPurchaseOrderDetails = () => {
    const { purchaseOrder } = formData;
    const expectedDeliveryAt = dayjs(purchaseOrder.expectedDeliveryAt);
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate('purchaseOrder.supplier')}>{purchaseOrder.supplier.name}</ShowText>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate('purchaseOrder.expectedDeliveryAt')}>{expectedDeliveryAt.format('YYYY-MM-DD')} </ShowText>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate('purchaseOrder.state')}>{purchaseOrder.state}</ShowText>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate('purchaseOrder.totalPrice')}>
            <NumberField source="totalPrice" record={purchaseOrder} options={{ style: 'currency', currency: 'HKD' }} />
          </ShowText>
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={6}>
        <PurchaseOrderAutocomplete
          onChange={handleSelect}
          defaultValue={formData.purchaseOrder}
        />
      </Grid>
      {formData.purchaseOrder && renderPurchaseOrderDetails()}
    </Grid>
  );
}

PurchaseOrderSelector.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default PurchaseOrderSelector;