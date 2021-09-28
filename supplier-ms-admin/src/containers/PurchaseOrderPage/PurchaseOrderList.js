import React from 'react';
import { useTranslate, List, Datagrid, TextField, ReferenceField, DateField, NumberField, EditButton } from 'react-admin'
import Actions from './Actions';

export const PurchaseOrderList = props => {
  const translate = useTranslate();
  return (
    <List {...props} title={translate('purchaseOrder.title')} actions={<Actions />} filter={{ state: 'DRAFT' }}>
      <Datagrid rowClick="show">
        <TextField source="code" label="Purchase Order No." />
        <DateField source="expectedDeliveryAt" />
        <TextField source="supplier.name" />
        <ReferenceField label={translate('puchaseOrder.supplier')} source="supplier" reference="Supplier" linkType="show">
          <TextField source="name" />
        </ReferenceField>
        <NumberField source="totalPrice" />
        <TextField source="state" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <EditButton />
      </Datagrid>
    </List>
  );
}
