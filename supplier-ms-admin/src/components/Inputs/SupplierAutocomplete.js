import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_SUPPLIER = gql`
  query suppliers($where: SupplierWhereInput) {
    suppliers(where: $where) {
      id
      name
      creditLine
    }
  }
`;

export default function SupplierAutocomplete({
  onChange,
  value: initialValue,
}) {
  const translate = useTranslate();
  const { loading: fetching, data } = useQuery(GET_SUPPLIER, {
    variables: { state: "APPROVED" },
  });
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
      setOptions(
        data.suppliers.map((obj) => ({
          id: obj.id,
          name: obj.name,
          creditLine: obj.creditLine,
        }))
      );
    }
  }, [loading, data]);

  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (evt, value) => {
    console.log("value: ", value);
    setValue(value);
    onChange(value);
  };

  return (
    <Autocomplete
      id="purchase-order-autocomplete"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      getOptionSelected={(option, v) => {
        return option.id === v;
      }}
      getOptionLabel={(option) => {
        return option.name;
      }}
      options={options}
      loading={loading}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate("supplier.supplier")}
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
