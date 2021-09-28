import React, { useState } from 'react';
import range from 'lodash/range';
import { useNotify, Datagrid, TextField, FormDataConsumer, useTranslate, NumberField } from 'react-admin';
import Grid from '@material-ui/core/Grid';
import { Field } from 'react-final-form';
import gql from 'graphql-tag';
import ItemAutocomplete from './ItemAutocomplete';
import ProductAutocomplete from './ProductAutocomplete';
import ShowText from '../../../components/Shows/ShowText';
import { useQuery } from '@apollo/react-hooks';
import BilingualField from '../../../components/BilingualField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const BoxSelectField = ({ source, record = {}, label, onChange, maxBox }) => {
  const boxNum = record[source];
  const handleChange = (e) => {
    onChange(e.target.value, record.itemId)
  };
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">Box</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={boxNum}
        onChange={handleChange}
      >
        {range(maxBox + 1).map(i => (
          <MenuItem key={`option-${record.itemId}-${i + 1}`} value={i + 1}>Box {i + 1}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default () => {
  const [maxBox, setMaxBox] = useState(1);
  return (
    <Field name="items">
      {({ input }) => {
        const translate = useTranslate();
        const { value, name, onChange } = input;
        console.log('value in box form', value);

        const handleChange = (boxNum, itemId) => {
          // check already exists
          const item = value.find(v => v.itemId === itemId);
          item.boxNum = boxNum;

          onChange([...value]);
          if (boxNum > maxBox) {
            setMaxBox(boxNum);
          }
        };

        // preparing record
        const record = value.reduce((r, v) => {
          r[v.itemId] = v;
          return r;
        }, {});

        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Datagrid
                data={record}
                ids={Object.keys(record)}
                resource="DeliveryNote"
                basePath="/DeliveryNote"
                currentSort={{ field: 'code', order: 'ASC' }}
              >
                <TextField source="productCode" />
                <BilingualField source="productName" />
                <NumberField source="label" />
                <BoxSelectField source="boxNum" onChange={handleChange} maxBox={maxBox} />
              </Datagrid>
            </Grid>
          </Grid>
        );
      }}
    </Field>
  );
}