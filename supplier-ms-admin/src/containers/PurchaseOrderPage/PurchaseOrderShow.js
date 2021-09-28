import React from 'react';
import { Show, SimpleShowLayout, Datagrid, TextField, ArrayField, DateField, NumberField } from 'react-admin'

export const PurchaseOrderShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="code" label="Purchase Order No." />
      <TextField source="supplier.id" />
      <ArrayField source="user"><Datagrid><TextField source="id" />
        <TextField source="name" />
        <TextField source="__typename" /></Datagrid></ArrayField>
      <DateField source="expectedDeliveryAt" />
      <NumberField source="unfinishedTax" />
      <NumberField source="totalPrice" />
      <TextField source="state" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <TextField source="products" />
    </SimpleShowLayout>
  </Show>
);
