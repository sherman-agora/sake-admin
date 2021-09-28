import React from 'react';
import { Edit, SimpleForm, TextInput, DateInput, NumberInput } from 'react-admin'

export const PurchaseOrderEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="code" label="Purchase Order No." />
      <DateInput source="expectedDeliveryAt" />
      <NumberInput source="unfinishedTax" />
      <NumberInput source="totalPrice" />
      <TextInput source="state" />
    </SimpleForm>
  </Edit>
);
