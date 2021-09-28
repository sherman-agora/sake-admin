import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Edit,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useTranslate,
  SaveButton,
  Toolbar,
  useUpdate,
  useNotify,
  FormDataConsumer,
  NumberInput,
  DateInput,
} from "react-admin";
import { useFormState } from "react-final-form";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import { Grid } from "@material-ui/core";

const redirect = () => "/SalesOrder";

const MySaveButton = (props) => {
  const { record } = props;
  const [edit] = useUpdate("SalesOrder", record.id);
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
    const { customer, ...formValues } = formState.values;
    const onSuccess = ({ data: newRecord }) => {
      notify("ra.notification.updated", "info", { smart_count: 1 }, true);
      redirect();
    };
    edit(
      {
        payload: {
          data: {
            state: formValues.state,
            discount: formValues.discount || 0,
            remark: formValues.remark,
            actualDate: formValues.actualDate,
          },
          previousData: record,
        },
      },
      { undoable: true, onSuccess }
    );
  }, [formState.valid, formState.values, record, notify, redirect, edit]);

  return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

const MyToolbar = (props) => (
  <Toolbar {...props}>
    <MySaveButton label="common.save" submitOnEnter={false} variant="text" />
  </Toolbar>
);

export const SalesOrderEdit = (props) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const [state, setState] = useState(null);
  const optionRenderer = (customer) => `${customer.code} ${customer.nameChi}`;
  return (
    <Edit {...props}>
      <SimpleForm toolbar={<MyToolbar />} redirect={redirect}>
        {/* <ReferenceInput label="Customer" source="customer.id" reference="Customer">
          <SelectInput optionText={optionRenderer} />
        </ReferenceInput> */}
        <TextInput source="code" disabled={true} label="Sales Order No." />
        <SelectInput
          source="state"
          choices={[
            { id: "RECEIVED", name: translate("common.received") },
            { id: "CONFIRMED", name: translate("common.confirmed") },
            { id: "INVOICED", name: "INVOICED" },
            { id: "PACKED", name: translate("common.packed") },
            { id: "SHIPPED", name: translate("common.shipped") },
            { id: "DELIVERED", name: translate("common.delivered") },
            { id: "PAID", name: translate("common.paid") },
            { id: "DELETED", name: translate("common.deleted") },
          ]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            console.log("state: ", formData.state);
            if (state === null) {
              setState(formData.state);
            }
            console.log("saved state", state);
            dispatch(
              setBreadcrumbs([
                { url: "/SalesOrder", label: "Sales Order" },
                {
                  url: `/SalesOrder/${formData.id}`,
                  label: `Edit: ${formData.code}`,
                },
              ])
            );
            console.log("formData: ", formData);
            if (!formData.discountType || formData.discountType == "") {
              formData.discountType = "cash";
            }
            if (!!formData.discountPercent) {
              const calculateDiscount =
                formData.grandTotal * (formData.discountPercent / 100);
              formData.discount = Math.round(calculateDiscount * 100) / 100;
            }

            if (state === formData.state) {
              return (
                <Grid container direction="column">
                  <Grid item>
                    <SelectInput
                      source="discountType"
                      allowEmpty={false}
                      choices={[
                        { id: "cash", name: "Discount Cash" },
                        { id: "present", name: "Discount percentage" },
                      ]}
                    />
                  </Grid>
                  <Grid item>
                    {formData.discountType == "present" ? (
                      <NumberInput
                        label="Discount Percent off: "
                        source="discountPercent"
                      />
                    ) : (
                      <NumberInput
                        label="Order Special offer(HKD)"
                        source="discount"
                      />
                    )}
                  </Grid>
                  <TextInput source="remark" multiline fullwidth />
                  <Grid item>
                    <DateInput source="actualDate" />
                  </Grid>
                </Grid>
              );
            } else {
              return null;
            }
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};
