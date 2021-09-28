import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslate } from 'react-admin';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_PRODUCT = gql`
  query products($where: ProductWhereInput!) {
    products(where: $where) {
      id
      code
      nameChi
      nameEn
      sku
      cost
    }
  }
`;

export default function ProductAutocomplete({ productId, onChange }) {
  const translate = useTranslate();
  const { loading: fetching, data } = useQuery(GET_PRODUCT, {
    variables: { where: {} },
  });
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = fetching || (open && options.length === 0);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (data) {
      console.log('GET data', data)
      setOptions(data.products.map(obj => ({ id: obj.id, name: `${obj.code} ${obj.nameChi}`, code: obj.code })));
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => onChange(data.products.find(o => o.id === value.id));
  return (
    <Autocomplete
      id="product-autocomplete"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      // getOptionSelected={(option, value) => option.id === productId}
      options={options}
      getOptionLabel={(option) => option.name}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label={translate('product.product')}
          fullWidth
          variant="filled"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}