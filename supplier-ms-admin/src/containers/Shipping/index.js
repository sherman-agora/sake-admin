import React from 'react';
import { CloneButton, Datagrid, DateField, DeleteButton, EditButton, List, TextField } from 'react-admin';

function Shipping(props) {
  return (
    <List {...props} resource="PurchaseOrder">
      <Datagrid rowClick="show">
        <TextField source="code" label="Shipping No." />
        <DateField source="expectedDeliveryAt" />
        <TextField source="state" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <CloneButton />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
}

export default Shipping;
