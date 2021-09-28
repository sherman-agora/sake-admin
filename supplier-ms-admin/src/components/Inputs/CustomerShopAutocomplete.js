import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_CUSTOMER = gql`
  query customer($where: CustomerWhereUniqueInput!) {
    customer(where: $where) {
      code
      id
      nameEn
      nameChi
      shops {
        id
        code
        nameChi
        nameEn
      }
    }
  }
`;

export default function CustomerShopAutocomplete({
  onChange,
  value: initialValue,
  customerId,
}) {
  const translate = useTranslate();
  console.log("customerId", customerId);
  const [customerID, setCustomerID] = useState();
  const { loading: fetching, data } = useQuery(GET_CUSTOMER, {
    variables: { where: { id: customerId } },
  });
  console.log(data && data);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const [options, setOptions] = useState([]);
  const loading = fetching || (open && options.length === 0);
  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (data) {
      setCustomerID(data.id);
      // setOptions(data.customer.shops.filter((obj) => !!obj).map((obj) => ({ id: obj.id, name: obj.nameChi })));
      setOptions(
        data.customer.shops
          .filter((obj) => !!obj)
          .map((obj) => ({ id: obj.id, name: obj.code }))
      );
    }
  }, [loading, data, customerID]);

  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    if (initialValue) {
      // setValue({ id: initialValue.id, name: initialValue.nameChi });
      setValue({ id: initialValue.id, name: initialValue.code });
    }
  }, [initialValue]);

  const handleChange = (evt, value) => {
    setValue(value);
    value && onChange(data.customer.shops.find((o) => o.id === value.id));
  };

  return (
    <Autocomplete
      id="customer-shop-autocomplete"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      getOptionSelected={(option, v) => {
        return option && option.id === v;
      }}
      getOptionLabel={(option) => {
        return option && option.name;
      }}
      options={options}
      loading={loading}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="CustomerShop"
          fullWidth
          variant="filled"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
