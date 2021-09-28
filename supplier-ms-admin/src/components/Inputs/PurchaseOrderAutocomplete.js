import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslate } from "react-admin";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_PURCHASE_ORDER = gql`
  query purchaseOrders(
    $where: PurchaseOrderWhereInput
    $orderBy: PurchaseOrderOrderByInput!
  ) {
    purchaseOrders(where: $where, orderBy: $orderBy) {
      id
      code
      supplier {
        id
        name
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
      expectedDeliveryAt
      totalPrice
      state
    }
  }
`;

export default function PurchaseOrderAutocomplete({
  onChange,
  defaultValue,
  className,
}) {
  const translate = useTranslate();
  const { loading: fetching, data } = useQuery(GET_PURCHASE_ORDER, {
    variables: {
      where: { state_in: ["CONFIRMED", "APPROVED"] },
      orderBy: "updatedAt_DESC",
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
      const { purchaseOrders } = data;
      setOptions(purchaseOrders.map((obj) => ({ id: obj.id, name: obj.code })));
    }
  }, [loading, data]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (evt, value) => {
    const { purchaseOrders } = data;
    onChange(purchaseOrders.find((po) => po.id === value.id));
  };

  return (
    <Autocomplete
      className={className}
      id="purchase-order-autocomplete"
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
          label={translate("purchaseOrder.purchaseOrder")}
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
