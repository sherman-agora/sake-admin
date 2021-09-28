import React from "react";
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  FormDataConsumer,
  FunctionField,
  List,
  required,
  ShowController,
  ShowView,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/CustomerGroup";
const breadcrumbBase = { url: "/CustomerGroup", label: "CustomerGroup" };

export const CustomerGroupCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/CustomerGroup/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" validate={required()} />
      </SimpleForm>
    </Create>
  );
};

export const CustomerGroupEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" validate={required()} />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/CustomerGroup/${formData.id}`,
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

export const CustomerGroupShow = (props) => {
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
              <TextField source="name" />
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};

export const CustomerGroupList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List {...props} exporter={false}>
      <Datagrid rowClick="show">
        <TextField source="name" />
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
