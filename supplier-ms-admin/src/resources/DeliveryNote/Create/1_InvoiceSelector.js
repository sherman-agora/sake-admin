import React from "react";
import Grid from "@material-ui/core/Grid";
import {
  SelectInput,
  NumberField,
  ReferenceInput,
  TextInput,
  ReferenceField,
  Datagrid,
  required,
  useTranslate,
  FormDataConsumer,
  TextField,
  ReferenceArrayField,
  DateInput,
  Show,
  ReferenceFieldController,
} from "react-admin";
import ShowText from "../../../components/Shows/ShowText";
import BilingualField from "../../../components/BilingualField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Field } from "react-final-form";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// import { TextField } from '@material-ui/core';

function InvoiceSelector({ formProps }) {
  const translate = useTranslate();

  const renderSalesOrderDetails = (formData) => {
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate("invoice.totalPrice")}>
            <ReferenceField
              resource="DeliveryNote"
              basePath="/DeliveryNote"
              source="invoiceId"
              reference="Invoice"
              record={formData}
              link={false}
            >
              <NumberField
                source="totalPrice"
                options={{ style: "currency", currency: "HKD" }}
              />
            </ReferenceField>
          </ShowText>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ShowText label={translate("invoice.state")}>
            <ReferenceField
              resource="DeliveryNote"
              basePath="/DeliveryNote"
              source="invoiceId"
              reference="Invoice"
              record={formData}
              link={false}
            >
              <TextField source="state" />
            </ReferenceField>
          </ShowText>
        </Grid>
        <Grid item xs={12}>
          <ReferenceField
            resource="DeliveryNote"
            basePath="/DeliveryNote"
            source="salesOrderId"
            reference="SalesOrder"
            record={formData}
            link={false}
          >
            <ReferenceArrayField
              reference="SalesOrderItem"
              source="productsIds"
              addLabel={false}
            >
              <Datagrid>
                <ReferenceField
                  label="#"
                  source="product.id"
                  reference="Product"
                  link="show"
                >
                  <TextField source="code" label="Product No." />
                </ReferenceField>
                <ReferenceField
                  label="Product Name"
                  source="product.id"
                  reference="Product"
                  link="show"
                >
                  <BilingualField source="name" />
                </ReferenceField>
                <NumberField
                  source="price"
                  options={{ style: "currency", currency: "HKD" }}
                />
                <TextField source="quantity" />
                <NumberField
                  source="totalPrice"
                  options={{ style: "currency", currency: "HKD" }}
                />
              </Datagrid>
            </ReferenceArrayField>
          </ReferenceField>
        </Grid>
      </React.Fragment>
    );
  };

  const renderCustomerInput = (formData) => {
    return (
      <Grid item xs={12} sm={6}>
        <ReferenceField
          resource="DeliveryNote"
          basePath="/DeliveryNote"
          source="salesOrderId"
          reference="SalesOrder"
          record={formData}
          link={false}
        >
          <ReferenceFieldController
            source="shop.id"
            reference="CustomerShop"
            record={formData}
            link={false}
          >
            {({ referenceRecord }) => (
              <SelectInput
                fullWidth
                choices={
                  referenceRecord && [
                    {
                      id: referenceRecord.id,
                      name: `${referenceRecord.nameChi} (${referenceRecord.code})`,
                    },
                  ]
                }
                defaultValue={referenceRecord && referenceRecord.id}
                disabled
                source="customerId"
              />
            )}
          </ReferenceFieldController>
        </ReferenceField>
      </Grid>
    );
  };

  const renderStatusInput = (formData) => {
    return (
      <Field name="state">
        {({ input }) => {
          const { value, name, onChange } = input;
          if (!value) {
            onChange("SENT");
          }

          const handleChange = (state) => {
            onChange(state);
          };
          return (
            <Grid item xs={12} sm={6}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="form-state">
                  {translate("salesOrder.state")}
                </InputLabel>
                <Select
                  label="form-state"
                  onChange={(e) => handleChange(e.target.value)}
                  title="Status"
                  defaultValue="SENT"
                >
                  {[
                    { id: "SENT", name: "SENT" },
                    { id: "PICKED", name: "PICKED" },
                    { id: "PACKED", name: "PACKED" },
                    { id: "DELIVERED", name: "DELIVERED" },
                  ].map((d) => (
                    <MenuItem key={`DN${d.id}`} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          );
        }}
      </Field>
    );
  };

  const renderInvoiceDetails = (formData, setFormData) => {
    const { invoiceId } = formData;
    return (
      <React.Fragment>
        <Grid item xs={12} sm={6}>
          <ReferenceField
            resource="DeliveryNote"
            basePath="/DeliveryNote"
            source="invoiceId"
            reference="Invoice"
            record={formData}
            link={false}
          >
            <ReferenceFieldController
              source="salesOrder.id"
              reference="SalesOrder"
              record={formData}
              link={false}
            >
              {({ referenceRecord }) => (
                <SelectInput
                  fullWidth
                  defaultValue={referenceRecord && referenceRecord.id}
                  disabled
                  choices={
                    referenceRecord && [
                      { id: referenceRecord.id, name: referenceRecord.code },
                    ]
                  }
                  source="salesOrderId"
                />
              )}
            </ReferenceFieldController>
          </ReferenceField>
        </Grid>
        {formData.salesOrderId && renderCustomerInput(formData)}
        {formData.customerId && renderStatusInput(formData)}
        {formData.customerId && renderSalesOrderDetails(formData)}
      </React.Fragment>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <ReferenceInput
          label="Select Invoice"
          source="invoiceId"
          reference="Invoice"
          resource="DeliveryNote"
          validate={required()}
          // filterToQuery={(searchText) => ({ code_contains: searchText })}
          filter={{ state: "CONFIRMED" }}
          sort={{ field: "createdAt", order: "DESC" }}
        >
          <SelectInput optionText="code" fullWidth label="Invoice No." />
        </ReferenceInput>
      </Grid>
      <FormDataConsumer subscription={{ values: true }}>
        {({ formData, ...others }) => {
          return formData.invoiceId && renderInvoiceDetails(formData);
        }}
      </FormDataConsumer>
    </Grid>
  );
}

export default InvoiceSelector;
