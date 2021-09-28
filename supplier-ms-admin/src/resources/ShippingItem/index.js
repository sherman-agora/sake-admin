import React from 'react';
import {
  List,
  Datagrid,
  Show,
  TabbedShowLayout,
  Tab,


  EditButton,
  DeleteButton,
  ReferenceManyField,
  TextField,
  DateField,
  useTranslate, Create, SimpleForm, TextInput, required, ImageInput, ImageField, NumberInput, DateInput, ReferenceInput, SelectInput, Edit,
} from 'react-admin';
import { useDispatch } from 'react-redux';
import { addBreadcrumbs } from '../../redux/breadcrumbs';

const redirect = () => '/Shipping';

export const ShippingItemCreate = props => {
  const dispatch = useDispatch();
  dispatch(addBreadcrumbs({url: '/ShippingItem/create', label: 'Add New Shipping Item'}));
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="code" validate={required()} label="Shipping No." />
        <TextInput source="nameEn" validate={required()} />
        <TextInput source="nameChi" validate={required()} />
        <TextInput source="shortDescription" />
        <TextInput source="longDescription" />
        <ImageInput source="images" accept="image/*" multiple>
          <ImageField source="src" title="title" />
        </ImageInput>
        <TextInput source="sku" />
        <TextInput source="upc" />
        <NumberInput source="minOrderQuantity" defaultValue={10} />
        <NumberInput source="minStockLevel" defaultValue={0} />
        <DateInput source="onlineDate" />
        <DateInput source="offlineDate" />
        <ReferenceInput label="Category" source="category.id" reference="ShippingItemCategory">
          <SelectInput optionText="nameEn" validate={required()} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
}

export const ShippingItemEdit = props => {
  const dispatch = useDispatch();
  dispatch(addBreadcrumbs({url: `/PurchaseOrderItem/${props.id}`, label: 'Edit Shipping Item'}));
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <NumberInput source="quantity" />
      </SimpleForm>
    </Edit>
  );
}

export const ShippingItemShow = props => {
  const translate = useTranslate();
  const dispatch = useDispatch();
  dispatch(addBreadcrumbs({url: `/PurchaseOrderItem/${props.id}/show`, label: 'Shipping Item'}));
  return (
    <Show {...props}>
      <TabbedShowLayout>
        <Tab label={translate('common.information')}>
          <TextField source="code" label="Shipping No." />
          <TextField source="totalPrice" />
          <DateField source="expectedDeliveryAt" />
          <TextField source="state" />
          <DateField source="createdAt" />
          <DateField source="updatedAt" />
        </Tab>
        <Tab label={translate('purchaseOrder.products')} path="products">
          <ReferenceManyField reference="ShippingItem" target="shipping" addLabel={false}>
            <Datagrid>
              <TextField source="price" />
              <TextField source="quantity" />
              <TextField source="totalPrice" />
              <EditButton />
            </Datagrid>
          </ReferenceManyField>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

export const ShippingItemList = props => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="code" label="Shipping No." />
        <TextField source="totalPrice" />
        <DateField source="expectedDeliveryAt" />
        <TextField source="state" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />

        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
