import React from 'react';
import { Typography } from '@material-ui/core';
import { useTranslate, NumberField } from 'react-admin';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import ShowText from '../../../components/Shows/ShowText';
import BilingualField from '../../../components/BilingualField';

function Review({ formData }) {
  const translate = useTranslate();
  const { salesOrder } = formData;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {translate('invoice.invoice')}
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ShowText label={translate('invoice.code')}>{formData.code}</ShowText>
        </Grid>

        <Grid item xs={12} sm={4}>
          <ShowText label={translate('invoice.customer')}>
            <BilingualField source="name" record={salesOrder.shop.customer} />
          </ShowText>
        </Grid>

        <Grid item xs={12} sm={4}>
          <ShowText label="Shop" >
            <BilingualField source="name" record={salesOrder.shop} />
          </ShowText>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ShowText label={translate('invoice.state')}>{formData.state}</ShowText>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ShowText label={translate('invoice.salesOrderCode')}>{formData.salesOrderCode}</ShowText>
        </Grid>
        <Grid item xs={12}>
          <Table aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  Details
                </TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Total/(HKD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                salesOrder.products && salesOrder.products.map(product => {
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <BilingualField source="name" record={product.product} />
                      </TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        <NumberField source="price" record={product} options={{ style: 'currency', currency: 'HKD' }} />
                      </TableCell>
                      <TableCell align="right">
                        <NumberField source="totalPrice" record={product} options={{ style: 'currency', currency: 'HKD' }} />
                      </TableCell>
                    </TableRow>
                  );
                })
              }
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell align="right">
                  <NumberField source="totalPrice" record={formData} options={{ style: 'currency', currency: 'HKD' }} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Review;
;