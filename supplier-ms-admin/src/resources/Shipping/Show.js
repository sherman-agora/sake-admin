import { DateField, NumberField, Datagrid, ReferenceField, ReferenceArrayField, Show, SimpleShowLayout, SingleFieldList, TextField, TopToolbar, useTranslate, Tab, ReferenceManyField, ShowController, ShowView } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import BilingualField from '../../components/BilingualField';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs } from '../../redux/breadcrumbs';

export const ShippingShow = props => {
  const dispatch = useDispatch();

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Typography variant="h6">
          Shipping no.&nbsp;
        </Typography>
        <ShowController title="Purchase Order Details" actions={<React.Fragment />} {...props}>
          {controllerProps => {
            const label = controllerProps.record ? controllerProps.record.code : '';
            const id = controllerProps.record ? controllerProps.record.id : '';
            dispatch(setBreadcrumbs([{ url: '/Shipping', label: 'Shipping' }, { url: `/Shipping/${id}/show`, label: `Details: ${label}` }]));
            return (
              <ShowView {...controllerProps}>
                <SimpleShowLayout>
                  <TextField source="code" label="Shipping No." />
                  <DateField source="createdAt" />
                  <DateField source="updatedAt" />
                </SimpleShowLayout>
              </ShowView>
            );
          }}
        </ShowController>
      </Grid>
      <Grid item container xs={3} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Total Price</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField source="totalPrice" options={{ style: 'currency', currency: 'HKD' }} />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Delivery Date</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <DateField source="deliveryAt" />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Purchase Order</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceField label="Purchase Order" reference="PurchaseOrder" source="purchaseOrder.id" link="show">
                <TextField source="code" label="Purchase Order No." />
              </ReferenceField>
              <ReferenceField label="Purchase Order" reference="PurchaseOrder" source="purchaseOrder.id" link="show">
                <NumberField source="totalPrice" options={{ style: 'currency', currency: 'HKD' }} />
              </ReferenceField>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item container xs={12} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Items</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceArrayField label="Items" reference="ShippingItem" source="productsIds">
                <Datagrid>
                  <ReferenceField label="#" source="product.id" reference="Product">
                    <TextField source="code" label="Product No." />
                  </ReferenceField>
                  <ReferenceField label="Product Name" source="product.id" reference="Product">
                    <BilingualField source="name" />
                  </ReferenceField>
                  <TextField source="labelFrom" />
                  <TextField source="labelTo" />
                  <DateField source="expiryDate" />
                  <NumberField source="price" options={{ style: 'currency', currency: 'HKD' }} />
                  <TextField source="quantity" />
                  <NumberField source="totalPrice" options={{ style: 'currency', currency: 'HKD' }} />
                </Datagrid>
              </ReferenceArrayField>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
    </Grid>
  );
}