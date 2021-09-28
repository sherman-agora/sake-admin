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
  TextInput,
  RadioButtonGroupInput,
  required,
  FormDataConsumer,
  ShowController,
  ShowView,
  FunctionField,
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/Warehouse";
const breadcrumbBase = { url: "/Warehouse", label: "Warehouse" };

export const WarehouseCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/Warehouse/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" validate={required()} />
        <TextInput source="description" />
        <TextInput source="address" />
        <RadioButtonGroupInput
          source="type"
          choices={[
            { id: "NORMAL", name: "Normal" },
            { id: "TEMPORARY", name: "Temporary" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export const WarehouseEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" validate={required()} />
        <TextInput source="description" />
        <TextInput source="address" />
        <RadioButtonGroupInput
          source="type"
          choices={[
            { id: "NORMAL", name: "Normal" },
            { id: "TEMPORARY", name: "Temporary" },
          ]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/Warehouse/${formData.id}`,
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

export const WarehouseList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List {...props} exporter={false}>
      <Datagrid rowClick="show">
        <TextField source="name" />
        <TextField source="description" />
        <TextField source="type" />

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

export const WarehouseShow = (props) => {
  const dispatch = useDispatch();
  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const label = controllerProps.record ? controllerProps.record.name : "";
        const id = controllerProps.record ? controllerProps.record.id : "";
        dispatch(
          setBreadcrumbs([
            breadcrumbBase,
            { url: `/CustomerGroup/${id}/show`, label: `Details: ${label}` },
          ])
        );
        return (
          <ShowView {...props} {...controllerProps}>
            <SimpleShowLayout>
              <TextField source="id" />
              <TextField source="name" />
              <TextField source="description" />
              <TextField source="address" />
              <TextField source="type" />
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};
