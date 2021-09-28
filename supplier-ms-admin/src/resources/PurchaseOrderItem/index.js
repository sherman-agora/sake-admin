import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  SaveButton,
  Toolbar,
  useCreate,
  useNotify,
  Create,
  SimpleForm,
  AutocompleteInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  Edit,
  FormDataConsumer,
} from "react-admin";
import { useFormState } from "react-final-form";
import { useDispatch } from "react-redux";
import { addBreadcrumbs } from "../../redux/breadcrumbs";
import { Grid, Container } from "@material-ui/core";

const SaveItemButton = (props) => {
  const [create] = useCreate("PurchaseOrderItem");
  const history = useHistory();

  const redirect = () => {
    return history.go(-1);
  };

  const notify = useNotify();

  const formState = useFormState();
  const handleClick = useCallback(() => {
    if (!formState.valid) {
      return;
    }
    const { product, ...formValues } = formState.values;
    create(
      {
        payload: { data: { ...formValues, productId: product.id } },
      },
      {
        onSuccess: ({ data: newRecord }) => {
          notify("ra.notification.created", "info", {
            smart_count: 1,
          });
          redirect();
        },
      }
    );
  }, [formState.valid, formState.values, create, notify, redirect]);

  return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

const PurchaseOrderItemCreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveItemButton label="common.save" submitOnEnter={false} variant="text" />
  </Toolbar>
);

export function PurchaseOrderItemCreate(props) {
  const [selectedProduct, setSelectedProduct] = useState();
  const dispatch = useDispatch();
  dispatch(
    addBreadcrumbs({
      url: "/PurchaseOrderItem/create",
      label: "Add New Purchase Order Item",
    })
  );

  const searchProduct = (searchText) => ({
    code_contains: searchText,
  });

  const inputText = (record) => () => {
    setSelectedProduct(record);
    return `${record.code} ${record.nameChi}`;
  };

  const OptionRenderer = (choice) =>
    `${choice.record.code} ${choice.record.nameChi}`;

  const renderInput = () => {
    return (
      <FormDataConsumer>
        {({ formData, ...rest }) => {
          return (
            <Grid container direction="column" style={{ width: 280 }}>
              <NumberInput source="quantity" initialsValue={0} />
              <NumberInput source="price" initialValue={formData.price} />
            </Grid>
          );
        }}
      </FormDataConsumer>
    );
  };

  return (
    <Create {...props}>
      <SimpleForm
        toolbar={<PurchaseOrderItemCreateToolbar />}
        variant="standard"
      >
        <ReferenceInput
          label="Purchase Order"
          source="purchaseOrder.id"
          reference="PurchaseOrder"
        >
          <SelectInput disabled optionText="code" label="Purchase Order No." />
        </ReferenceInput>
        <ReferenceInput
          filterToQuery={searchProduct}
          label="Product"
          source="product.id"
          reference="Product"
        >
          <AutocompleteInput
            optionText={<OptionRenderer />}
            label="Purchase Order No."
            inputText={inputText}
            matchSuggestion={(filterValue, suggestion) => true}
            options={{ style: { width: 500 } }}
          />
        </ReferenceInput>
        {selectedProduct && renderInput()}
      </SimpleForm>
    </Create>
  );
}

export const PurchaseOrderItemEdit = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const redirect = () => {
    return history.go(-1);
  };
  return (
    <Edit actions={<React.Fragment />} {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <ReferenceInput
          label="Purchase Order"
          source="purchaseOrder.id"
          reference="PurchaseOrder"
        >
          <SelectInput disabled optionText="code" label="Purchase Order No." />
        </ReferenceInput>
        <ReferenceInput label="Product" source="product.id" reference="Product">
          <SelectInput disabled optionText="code" label="Purchase Order No." />
        </ReferenceInput>

        <NumberInput source="quantity" initialValue="quantity" />

        <NumberInput source="price" initialValue="cost" />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              addBreadcrumbs({
                url: `/PurchaseOrderItem/${formData.id}`,
                label: `Edit`,
              })
            );
            return null;
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};
