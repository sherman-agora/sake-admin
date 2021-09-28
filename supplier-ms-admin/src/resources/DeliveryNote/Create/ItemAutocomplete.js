import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

// remove query warehouse
const GET_ITEMS = gql`
  query inventoryItems($where: InventoryItemWhereInput) {
    inventoryItems(where: $where, first: 10) {
      id
      label
      expiryDate
      product {
        id
        code
        nameEn
        nameChi
      }
    }
  }
`;

export default function InventoryItemAutocomplete({
  onChange,
  defaultValue,
  products,
}) {
  console.log(products.map((product) => product.product.id));
  const [label, setLabel] = useState("");
  const translate = useTranslate();
  const { loading: fetching, data } = useQuery(GET_ITEMS, {
    variables: {
      where: {
        label_contains: label,
        productId_in: products.map((p) => p.product.id),
        warehouse: { name_not: "OUT" },
      },
    },
  });
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = fetching || (open && options.length === 0);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (data) {
      console.log("get!!!!data", data);
      const { inventoryItems } = data;
      const filteredItems = inventoryItems.filter((item) =>
        products.map((p) => p.product.code).includes(item.product.code)
      );
      // setOptions(
      //   filteredItems.map((obj) => ({
      //     id: obj.id,
      //     name: `(${obj.label} - ${obj.product.code}-${obj.product.nameChi} `,
      //   }))
      // );
      setOptions(
        inventoryItems.map((obj) => ({
          id: obj.id,
          name: `(${obj.label} - ${obj.product.code}-${obj.product.nameChi} `,
        }))
      );
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => {
    const { inventoryItems } = data;
    if (!value) {
      return;
    }
    onChange(inventoryItems.find((obj) => obj.id === value.id));
    setLabel("");
  };

  const handleInputChange = (e, value) => {
    setLabel(value);
  };

  return (
    <Autocomplete
      id="purchase-order-autocomplete"
      autoSelect
      autoComplete
      autoHighlight
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleChange}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option) => option.id}
      options={options}
      loading={loading}
      value={defaultValue && { id: defaultValue.id, name: defaultValue.code }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by label..."
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
