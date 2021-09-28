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
  required,
  FormDataConsumer,
  ShowController,
  ShowView,
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";

const redirect = () => "/ProductCategory";
const breadcrumbBase = { url: "/ProductCategory", label: "Product Category" };

export const ProductCategoryCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/ProductCategory/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="nameEn" validate={required()} />
        <TextInput source="nameChi" validate={required()} />
        <TextInput source="detail" multiline />
      </SimpleForm>
    </Create>
  );
};

export const ProductCategoryEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="nameEn" validate={required()} />
        <TextInput source="nameChi" validate={required()} />
        <TextInput source="detail" multiline />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/ProductCategory/${formData.id}`,
                  label: `Edit: ${formData.nameEn}`,
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

export const ProductCategoryShow = (props) => {
  const dispatch = useDispatch();
  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const label = controllerProps.record
          ? controllerProps.record.nameEn
          : "";
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
              <TextField source="nameEn" />
              <TextField source="nameChi" />
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};

export const ProductCategoryList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List {...props} exporter={false}>
      <Datagrid rowClick="show">
        <TextField source="nameEn" />
        <TextField source="nameChi" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
