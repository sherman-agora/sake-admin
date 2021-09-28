import React from "react";
import {
  Create,
  Datagrid,
  Edit,
  EditButton,
  FunctionField,
  List,
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

const redirect = () => "/UserGroup";
const breadcrumbBase = { url: "/UserGroup", label: "UserGroup" };

export const UserGroupCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/UserGroup/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" />
      </SimpleForm>
    </Create>
  );
};

export const UserGroupEdit = (props) => {
  const dispatch = useDispatch();
  const { loaded, permissions } = usePermissions();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/UserGroup/edit", label: "UserGroup Edit" },
    ])
  );

  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  );
};

export const UserGroupShow = (props) => {
  const dispatch = useDispatch();
  const { loaded, permissions } = usePermissions();

  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const id = controllerProps.record ? controllerProps.record.id : "";
        dispatch(
          setBreadcrumbs([
            breadcrumbBase,
            { url: `/UserGroup/${id}/show`, label: `Details` },
          ])
        );
        return (
          <ShowView
            {...props}
            {...controllerProps}
            hasEdit={permissions === "admin" || permissions === "superadmin"}
          >
            <SimpleShowLayout>
              <TextField source="name" />
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};

export const UserGroupList = (props) => {
  const dispatch = useDispatch();
  const { loaded, permissions } = usePermissions();
  const group = JSON.parse(localStorage.getItem("group"));
  console.log("group", group.id);
  console.log("permissions", permissions);
  dispatch(setBreadcrumbs([breadcrumbBase]));

  return (
    <List
      {...props}
      exporter={false}
      hasCreate={permissions === "superadmin"}
      sort={{ field: "name", order: "DESC" }}
      filterDefaultValues={
        permissions === "superadmin" ? null : { id: group.id }
      }
    >
      <Datagrid rowClick="show">
        <TextField source="name" />
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
