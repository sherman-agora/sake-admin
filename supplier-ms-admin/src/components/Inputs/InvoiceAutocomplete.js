import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslate } from 'react-admin';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_SALES_ORDER = gql`
  query invoices($where: InvoiceWhereInput) {
    invoices(where: $where) {
      id
      code
      salesOrder {
        id
        code
        customer {
          id
          nameEn
          nameChi
        }
        products {
          id
          quantity
          price
          totalPrice
          product {
            id
            code
            nameEn
            nameChi
          }
        }
        totalPrice
        state
      }
      totalPrice
      remark
      shipmentDate
      state
      createdAt
      updatedAt
      paidAt
    }
  }
`;

export default function InvoiceAutocomplete({ onChange, defaultValue }) {
  const translate = useTranslate();
  const { loading: fetching, data } = useQuery(GET_SALES_ORDER, {});
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = fetching || (open && options.length === 0);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (data) {
      const { invoices } = data;
      setOptions(invoices.map(obj => ({ id: obj.id, name: obj.code })));
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => {
    const { invoices } = data;
    onChange(invoices.find(po => po.id === value.id));
  };

  return (
    <Autocomplete
      id="sales-order-autocomplete"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      value={defaultValue && ({ id: defaultValue.id, name: defaultValue.code })}
      renderInput={params => (
        <TextField
          {...params}
          label={translate('invoice.invoice')}
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