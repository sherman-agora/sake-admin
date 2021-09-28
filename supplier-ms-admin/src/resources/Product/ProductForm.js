import { useForm } from 'react-final-form';
import { AutocompleteInput, DateInput, number, NumberInput, ReferenceInput, required, TextInput, useDataProvider } from 'react-admin';
import React from 'react';
import Box from '@material-ui/core/Box';

const ProductForm = ({ getSource }) => {
  const form = useForm();
  const dataProvider = useDataProvider();
  const updateDefaultValue = (id) => {
    dataProvider.getOne('Product', { id })
      .then(({ data }) => {
        // scopedFormData.price = data.cost;
        form.change(getSource('code'), data.code);
        form.change(getSource('name'), data.nameChi);
        form.change(getSource('price'), data.cost);
        form.change(getSource('quantity'), data.minOrderQuantity);
      });
  };
  return (
    <Box display="flex">
      <Box flex={1} mr="0.5em">
        <ReferenceInput label="Select Product" source={getSource('id')} reference="PurchaseOrderProduct" validate={required()} filterToQuery={searchText => ({ code_starts_with: searchText })} onChange={updateDefaultValue}>
          <AutocompleteInput optionText={choice => `${choice.code} - ${choice.nameChi}`} fullWidth />
        </ReferenceInput>
        <Box display="flex">
          <Box flex={1} mr="0.5em">
            <TextInput source={getSource('code')} validate={required()} label="Product no." fullWidth disabled />
          </Box>
          <Box flex={2} mr="0.5em">
            <TextInput source={getSource('name')} validate={required()} label="Name" fullWidth disabled />
          </Box>
        </Box>

        <Box display="flex">
          <Box flex={1} mr="0.5em">
            <TextInput source={getSource('price')} validate={[required(), number()]} label="Price" fullWidth />
          </Box>
          <Box flex={1} mr="0.5em">
            <NumberInput source={getSource('quantity')} validate={[required(), number()]} label="Quantity" fullWidth />
          </Box>
          <Box flex={1} mr="0.5em">
            <DateInput source={getSource('expiryDate')} label="ExpiryDate" fullWidth />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductForm;