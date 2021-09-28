import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_SALES_ORDER = gql`
  query salesOrders($where: SalesOrderWhereInput) {
    salesOrders(where: $where, orderBy: updatedAt_DESC) {
      id
      code
      shop {
        id
        code
        nameEn
        nameChi
        deliveryDay
        customer {
          id
          nameEn
          nameChi
        }
      }
      products {
        id
        quantity
        price
        totalPrice
        product {
          code
          nameEn
          nameChi
        }
      }
      grandTotal
      state
    }
  }
`;

export default function SalesOrderAutocomplete({
  onChange,
  defaultValue,
  where = {},
}) {
  const translate = useTranslate();
  console.log("where", where);
  const { loading: fetching, data } = useQuery(GET_SALES_ORDER, where);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = fetching || (open && options.length === 0);

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (data) {
      const { salesOrders } = data;
      setOptions(
        salesOrders
          .filter((obj) => !!obj)
          .map((obj) => ({ id: obj.id, name: obj.code }))
      );
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => {
    const { salesOrders } = data;
    onChange(
      salesOrders.filter((obj) => !!obj).find((po) => po.id === value.id)
    );
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
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      value={defaultValue && { id: defaultValue.id, name: defaultValue.code }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate("salesOrder.salesOrder")}
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
