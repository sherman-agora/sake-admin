import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslate } from 'react-admin';
import QuantityCheckTable from './QuantityCheckTable';

function Review({ formData }) {
  const translate = useTranslate();
  const { products } = formData.purchaseOrder;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {translate('menu.item.shipping')}
      </Typography>
      <QuantityCheckTable products={products} />
    </React.Fragment>
  );
}

export default Review;
