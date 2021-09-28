import React from "react";
import {
  ChipField,
  Create,
  Datagrid,
  Edit,
  EditButton,
  FunctionField,
  List,
  PasswordInput,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  ShowController,
  ShowView,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  usePermissions,
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/User";
const breadcrumbBase = { url: "/User", label: "User" };

export const UserCreate = (props) => {
  const dispatch = useDispatch();
  const { loaded, permissions } = usePermissions();
  const group = JSON.parse(localStorage.getItem("group"));

  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/User/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" />
        <PasswordInput source="password" />
        <ReferenceInput
          label="Company Group"
          source="group.id"
          reference="UserGroup"
          filter={permissions === "superadmin" ? {} : { id: group.id }}
        >
          <SelectInput source="name" />
        </ReferenceInput>
        <SelectInput
          source="permission"
          choices={
            permissions === "superadmin"
              ? [
                  { id: "ADMIN", name: "ADMIN" },
                  { id: "ACCOUNT", name: "ACCOUNT" },
                  { id: "SALES", name: "SALES" },
                  { id: "INVENTORY", name: "INVENTORY" },
                  { id: "SUPERADMIN", name: "SUPERADMIN" },
                ]
              : [
                  { id: "ADMIN", name: "ADMIN" },
                  { id: "ACCOUNT", name: "ACCOUNT" },
                  { id: "SALES", name: "SALES" },
                  { id: "INVENTORY", name: "INVENTORY" },
                ]
          }
        />
      </SimpleForm>
    </Create>
  );
};

export const UserEdit = (props) => {
  const dispatch = useDispatch();
  const group = JSON.parse(localStorage.getItem("group"));
  const { loaded, permissions } = usePermissions();
  dispatch(
    setBreadcrumbs([breadcrumbBase, { url: "/User/edit", label: "User Edit" }])
  );

  return (
    <Edit {...props}>
      {permissions === "admin" || permissions === "superadmin" ? (
        <SimpleForm variant="standard" redirect={redirect}>
          <TextInput source="name" />
          {permissions === "superadmin" ? (
            <PasswordInput source="password" />
          ) : null}
          <ReferenceInput
            label="Company Group"
            source="group.id"
            reference="UserGroup"
            filter={permissions === "superadmin" ? {} : { id: group.id }}
          >
            <SelectInput source="name" />
          </ReferenceInput>

          <SelectInput
            source="permission"
            choices={
              permissions === "superadmin"
                ? [
                    { id: "ADMIN", name: "ADMIN" },
                    { id: "ACCOUNT", name: "ACCOUNT" },
                    { id: "SALES", name: "SALES" },
                    { id: "INVENTORY", name: "INVENTORY" },
                    { id: "SUPERADMIN", name: "SUPERADMIN" },
                  ]
                : [
                    { id: "ADMIN", name: "ADMIN" },
                    { id: "ACCOUNT", name: "ACCOUNT" },
                    { id: "SALES", name: "SALES" },
                    { id: "INVENTORY", name: "INVENTORY" },
                  ]
            }
          />
        </SimpleForm>
      ) : (
        <h1>No Permission</h1>
      )}
    </Edit>
  );
};

export const UserShow = (props) => {
  const dispatch = useDispatch();
  const { loaded, permissions } = usePermissions();

  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const id = controllerProps.record ? controllerProps.record.id : "";
        dispatch(
          setBreadcrumbs([
            breadcrumbBase,
            { url: `/User/${id}/show`, label: `Details` },
          ])
        );
        return (
          <ShowView
            {...props}
            {...controllerProps}
            hasEdit={permissions === "superadmin" || permissions === "admin"}
          >
            <SimpleShowLayout>
              <TextField source="name" />
              <TextField source="permission" />
              {permissions === "superadmin" ? (
                <TextField source="password" />
              ) : null}
              <ReferenceField
                label="company Group"
                source="group.id"
                reference="UserGroup"
                link="show"
              >
                <TextField source="name" />
              </ReferenceField>
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};

export const UserList = (props) => {
  const dispatch = useDispatch();
  const { loaded, permissions } = usePermissions();
  const group = JSON.parse(localStorage.getItem("group"));
  console.log("group", group);
  console.log("permissions", permissions);
  dispatch(setBreadcrumbs([breadcrumbBase]));

  return (
    <List
      {...props}
      exporter={false}
      hasCreate={permissions === "admin" || permissions === "superadmin"}
      sort={{ field: "createdAt", order: "DESC" }}
      filterDefaultValues={
        permissions === "superadmin"
          ? {}
          : {
              permission_not: "SUPERADMIN",
              group: { id: group.id },
            }
      }
    >
      <Datagrid rowClick="show">
        <TextField source="name" />
        <ReferenceField
          label="company group"
          source="group.id"
          reference="UserGroup"
          link="show"
        >
          <ChipField source="name" />
        </ReferenceField>
        {/* <TextField source="group" /> */}
        <TextField source="permission" />
        {permissions === "admin" || permissions === "superadmin" ? (
          <EditButton />
        ) : null}
        {permissions === "superadmin" ? (
          <FunctionField
            render={(record) => <DeleteDialog record={record} props={props} />}
          />
        ) : null}
      </Datagrid>
    </List>
  );
};
