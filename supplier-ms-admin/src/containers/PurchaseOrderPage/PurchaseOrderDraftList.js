import React from 'react';
import { useTranslate, List, Datagrid, TextField, ArrayField, DateField, NumberField } from 'react-admin'
import Actions from './Actions';

export const PurchaseOrderDraftList = props => {
  const translate = useTranslate();
  return (
    <List {...props} title={translate('purchaseOrder.title')} actions={<Actions />} filter={{ state: 'DRAFT' }}>
      <Datagrid rowClick="show">
        <TextField source="code" label="Purchase Order No." />
        <DateField source="expectedDeliveryAt" />
        <TextField source="supplier.name" />
        <NumberField source="totalPrice" />
        <TextField source="state" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
      </Datagrid>
    </List>
  );
}
