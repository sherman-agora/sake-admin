import React, { useEffect, useState } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { useTranslate, ReferenceInput, SelectInput } from "react-admin";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import CustomerAutocomplete from "../../../components/Inputs/CustomerAutocomplete";
import CustomerShopAutocomplete from "../../../components/Inputs/CustomerShopAutocomplete";
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

function BasicForm({ formData, setFormData }) {
  const translate = useTranslate();
  const [customerShops, setCustomerShops] = useState();

  const { loading, data } = useQuery(GET_CUSTOMER, {
    variables: { where: { id: formData.customer && formData.customer.id } },
  });

  useEffect(() => {
    if (data) {
      setCustomerShops(data.customer.shops);
      console.log(data);
    }
  });

  return (
    <form noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CustomerAutocomplete
            variant="filled"
            fullWidth
            value={formData.customer}
            label={translate("salesOrder.code")}
            onChange={(newValue) => {
              setFormData({ ...formData, customer: newValue });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id="customer-shops"
            options={customerShops}
            getOptionLabel={(option) => option.nameEn}
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
            onChange={(event, value) => {
              console.log(value);
              setFormData({ ...formData, customerShop: value });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="filled"
            fullWidth
            value={formData.code}
            label={translate("salesOrder.code")}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="form-state">
              {translate("salesOrder.state")}
            </InputLabel>
            <Select
              labelId={"state"}
              label="form-state"
              value={formData.state || "RECEIVED"}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              disabled={true}
            >
              {[
                { id: "RECEIVED", name: translate("common.received") },
                // { id: 'CONFIRMED', name: translate('common.confirmed') },
                // { id: 'PACKED', name: translate('common.packed') },
                // { id: 'SHIPPED', name: translate('common.shipped') },
                // { id: 'DELIVERED', name: translate('common.delivered') },
                // { id: 'PAID', name: translate('common.paid') },
                // { id: 'DELETED', name: translate('common.deleted') },
              ].map((d) => (
                <MenuItem key={`POSelect${d.id}`} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
}

export default BasicForm;
