import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useQuery } from '@apollo/react-hooks';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';

const GET_ITEMS = gql`
  query inventoryItems($where: InventoryItemWhereInput!) {
    inventoryItems(where: $where, first: 10) {
      id
      label
      expiryDate
      product {
        id
        code
        nameEn
        nameChi
        brandEn
        brandChi
      }
      warehouse {
        id
        name
      }
    }
  }
`;

function ItemAutocomplete({ onChange, value }) {
  const [label, setLabel] = useState('');
  const [options, setOptions] = React.useState([]);
  const { loading, data } = useQuery(GET_ITEMS, {
    variables: {
      where: {
        label_starts_with: label,
      }
    }
  });
  useEffect(() => {
    if (data) {
      setOptions(data.inventoryItems);
    }
  }, [data]);

  const handleChange = (e, item) => {
    onChange(item);
    e.currentTarget.blur();
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={option => `${option.label} ${option.product.nameChi}`}
      onChange={handleChange}
      loading={loading}
      value={value}
      renderInput={params => (
        <TextField
          {...params}
          variant="standard"
          label="Label #"
          placeholder="1000001"
          fullWidth
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

ItemAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default ItemAutocomplete;
