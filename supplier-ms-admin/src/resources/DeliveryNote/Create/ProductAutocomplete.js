import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery } from "@apollo/react-hooks";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";

// remove query warehouse
const GET_PRODUCTS = gql`
  query products($where: ProductWhereInput) {
    products(where: $where) {
      id
      code
      nameChi
      nameEn
      inventoryItems {
        id
        label
        expiryDate
        product {
          id
          code
          nameChi
          nameEn
        }
        warehouse {
          name
        }
      }
    }
  }
`;

const GET_PRODUCT_ID = gql`
  query products($where: ProductWhereInput!) {
    products(where: $where) {
      id
    }
  }
`;
// product -> item
const GET_ITEM = gql`
  query inventoryItems($where: InventoryItemWhereInput!) {
    inventoryItems(where: $where, first: 20) {
      id
      label
      expiryDate
      product {
        id
        code
        nameChi
        nameEn
      }
      warehouse {
        name
      }
    }
  }
`;

export default function ProductAutocomplete({ onChange, value, productIds }) {
  const [code, setCode] = useState("");
  const [productID, setProductID] = useState("");
  const { loading: fetchID, productData } = useQuery(GET_PRODUCT_ID, {
    variables: {
      where: { id_in: productIds, code_contains: code },
    },
    onCompleted: (value) => {
      getItem({
        variables: {
          where: {
            productId_in:
              value.products.length >= 1 ? value.products[0].id : "",
          },
        },
      });
    },
  });

  const [getItem, { loading: fetching, data }] = useLazyQuery(GET_ITEM, {
    onCompleted: (value) => {
      const inventoryItems = !!value ? value.inventoryItems : [];

      const item = inventoryItems
        .filter((item) => item.warehouse.name !== "OUT")
        .reduce((results, item) => {
          results = [
            ...results,
            {
              id: `${item.product.id}-${item.id}`,
              name: `${item.product.code}-${item.product.nameChi} (${
                item.label || "No Label"
              })`,
            },
          ];
          return results;
        }, []);

      setOptions(item);
    },
  });
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = fetching || (open && options.length === 0);

  // React.useEffect(() => {
  //   if (!loading) {
  //     return undefined;
  //   }

  //   if (data) {
  //     const { inventoryItems } = data;
  //
  //     const item = inventoryItems
  //       .filter((item) => item.warehouse.name !== "OUT")
  //       .reduce((results, item) => {
  //

  //         results = [
  //           ...results,
  //           {
  //             id: `${item.product.id}-${item.id}`,
  //             name: `${item.product.code}-${item.product.nameChi} (${
  //               item.label || "No Label"
  //             })`,
  //           },
  //         ];
  //         return results;
  //       }, []);
  //
  //     setOptions(item);
  //   }
  // }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => {
    const [productId, itemId] = value ? value.id.split("-") : [];
    const { inventoryItems } = data;
    if (!inventoryItems) {
      return;
    }
    onChange(inventoryItems.find((obj) => obj.id === itemId));
    setCode("");
  };

  const handleInputChange = (e, value) => {
    setCode(value);
  };

  return (
    <Autocomplete
      id="product-autocomplete"
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
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search by product code..."
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
