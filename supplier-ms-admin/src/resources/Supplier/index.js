import React from "react";
import {
  Create,
  Edit,
  SimpleForm,
  List,
  Datagrid,
  Show,
  SimpleShowLayout,
  EditButton,
  DeleteButton,
  TextField,
  EmailField,
  DateField,
  TextInput,
  required,
  email,
  FormDataConsumer,
  ShowController,
  ShowView,
  FunctionField,
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/Supplier";
const breadcrumbBase = { url: "/Supplier", label: "Supplier" };

export const SupplierCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/Supplier/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" validate={required()} />
        <TextInput source="email" validate={email()} />
        <TextInput source="country" />
        <TextInput source="phone" />
        <TextInput source="fax" />
        <TextInput multiline source="paymentTerms" />
      </SimpleForm>
    </Create>
  );
};

export const SupplierEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" validate={required()} />
        <TextInput source="email" validate={email()} />
        <TextInput source="country" />
        <TextInput source="phone" />
        <TextInput source="fax" />
        <TextInput source="paymentTerms" />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/Supplier/${formData.id}`,
                  label: `Edit: ${formData.name}`,
                },
              ])
            );
            return null;
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export const SupplierShow = (props) => {
  const dispatch = useDispatch();
  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const label = controllerProps.record ? controllerProps.record.name : "";
        const id = controllerProps.record ? controllerProps.record.id : "";
        dispatch(
          setBreadcrumbs([
            breadcrumbBase,
            { url: `/Supplier/${id}/show`, label: `Details: ${label}` },
          ])
        );
        return (
          <ShowView {...props} {...controllerProps}>
            <SimpleShowLayout>
              <TextField source="name" />
              <EmailField source="email" />
              <TextField source="country" />
              <TextField source="phone" />
              <TextField source="fax" />
              <TextField source="paymentTerms" />
              <DateField source="createdAt" />
              <DateField source="updatedAt" />
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};

export const SupplierList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List
      {...props}
      sort={{ field: "createdAt", order: "DESC" }}
      exporter={false}
    >
      <Datagrid rowClick="show">
        <TextField source="name" />
        <EmailField source="email" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />

        <EditButton />
        <FunctionField
          render={(record) => (
            <DeleteDialog
              record={record}
              props={props}
            // permissions={permissions}
            />
          )}
        />
      </Datagrid>
    </List>
  );
};
