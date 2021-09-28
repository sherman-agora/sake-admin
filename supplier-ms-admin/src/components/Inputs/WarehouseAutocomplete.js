import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_WAREHOUSES = gql`
  query warehouses($where: WarehouseWhereInput!) {
    warehouses(where: $where) {
      id
      name
      type
    }
  }
`;

export default function WarehouseAutocomplete({ onChange, defaultValue, className, where = { where: { type: "NORMAL" } } }) {
  const translate = useTranslate();
  const { loading: fetching, data } = useQuery(GET_WAREHOUSES, {
    variables: where,
  });
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = fetching || (open && options.length === 0);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (data) {
      const { warehouses } = data;
      setOptions(warehouses.map((obj) => ({ id: obj.id, name: obj.name })));
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => {
    const { warehouses } = data;
    onChange(warehouses.find((warehouse) => warehouse.id === value.id));
  };

  return (
    <Autocomplete
      className={className}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      value={defaultValue && { id: defaultValue.id, name: defaultValue.name }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate("product.warehouse")}
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
