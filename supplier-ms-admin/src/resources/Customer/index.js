import React from "react";
import {
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  email,
  EmailField,
  FormDataConsumer,
  FunctionField,
  List,
  ReferenceArrayField,
  ReferenceField,
  ReferenceInput,
  required,
  SelectInput,
  ShowController,
  ShowView,
  SimpleForm,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TextInput,
  useListContext,
  Pagination
} from "react-admin";
import { useDispatch } from "react-redux";
import BilingualField from "../../components/BilingualField";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/Customer";
const breadcrumbBase = { url: "/Customer", label: "Customer" };

export const CustomerCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/Customer/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="code" validate={required()} label="Customer No." />
        <TextInput source="nameEn" validate={required()} />
        <TextInput source="nameChi" validate={required()} />
        <TextInput source="mobile" validate={required()} />
        <TextInput source="email" validate={required()} />
        <TextInput source="district" />
        <TextInput source="billingAddress" />
        <TextInput source="salesman" />
        <TextInput source="website" />
        <TextInput source="remark" multiline />
        <ReferenceInput
          label="Group"
          source="group.id"
          reference="CustomerGroup"
        >
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>

        <SelectInput
          source="wholesalePlan"
          validate={required()}
          choices={[
            { id: 1, name: "Plan 1" },
            { id: 2, name: "Plan 2" },
            { id: 3, name: "Plan 3" },
            { id: 4, name: "Plan 4" },
            { id: 5, name: "Plan 5" },
          ]}
        />
        <SelectInput
          source="paymentMethod"
          validate={required()}
          choices={[
            { id: "credit", name: "Credit" },
            { id: "debit", name: "Debit" },
            { id: "c.o.d", name: "C.O.D" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export const CustomerEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <TextInput source="code" validate={required()} label="Customer No." />
        <TextInput source="nameEn" validate={required()} />
        <TextInput source="nameChi" validate={required()} />
        <TextInput source="mobile" />
        <TextInput source="email" validate={email()} />
        <TextInput source="district" />
        <TextInput source="billingAddress" />
        <TextInput source="salesman" />
        <TextInput source="website" />
        <TextInput source="remark" multiline />
        <TextInput source="logs" multiline fullWidth />
        <ReferenceInput
          label="Group"
          source="group.id"
          reference="CustomerGroup"
        >
          <SelectInput optionText="name" validate={required()} />
        </ReferenceInput>
        <SelectInput
          source="wholesalePlan"
          validate={required()}
          choices={[
            { id: 1, name: "Plan 1" },
            { id: 2, name: "Plan 2" },
            { id: 3, name: "Plan 3" },
            { id: 4, name: "Plan 4" },
            { id: 5, name: "Plan 5" },
          ]}
        />
        <SelectInput
          source="paymentMethod"
          validate={required()}
          choices={[
            { id: "CREDIT", name: "Credit" },
            { id: "DEBIT", name: "Debit" },
            { id: "COD", name: "C.O.D" },
          ]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/Customer/${formData.id}`,
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
function getWeekDay(dayNum) {
  switch (dayNum) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      break;
  }
}

export const CustomerShow = (props) => {
  const dispatch = useDispatch();
  return (
    <ShowController {...props}>
      {(controllerProps) => {
        console.log("controllerProps: ", controllerProps);
        const label = controllerProps.record
          ? controllerProps.record.nameEn
          : "";
        const id = controllerProps.record ? controllerProps.record.id : "";
        dispatch(
          setBreadcrumbs([
            breadcrumbBase,
            { url: `/Customer/${id}/show`, label: `Details: ${label}` },
          ])
        );
        return (
          <ShowView {...props} {...controllerProps}>
            <SimpleShowLayout>
              <TextField source="code" />
              <TextField source="nameEn" />
              <TextField source="nameChi" />
              <TextField source="wholesalePlan" />
              <TextField source="mobile" />
              <EmailField source="email" />
              <TextField source="district" />
              <TextField source="billingAddress" />
              <TextField source="salesman" />
              <TextField source="website" />
              <TextField source="remark" />
              <TextField source="logs" multiline />
              <ReferenceField
                label="Group"
                source="group.id"
                reference="CustomerGroup"
              >
                <TextField source="name" />
              </ReferenceField>
              <TextField source="paymentMethod" />
              <ReferenceArrayField
                label="Shops"
                reference="CustomerShop"
                source="shopsIds"
              >
                <SingleFieldList>
                  <ReferenceField
                    source="id"
                    reference="CustomerShop"
                    link={(shop, referece) => `/CustomerShop/${shop.id}/show`}
                  >
                    <TextField source="nameChi" />
                  </ReferenceField>
                </SingleFieldList>
              </ReferenceArrayField>

              <ReferenceArrayField
                label="Customer Coupons"
                reference="CustomerCoupon"
                source="couponsIds"
                filter={{ state_not_in: "EMPTY" }}
              >
                <Datagrid>
                  <TextField source="code" />
                  <TextField source="name" />
                  <TextField source="discount" />
                  <TextField source="state" />
                  <TextField source="quantity" />
                  <TextField source="type" />
                </Datagrid>
              </ReferenceArrayField>
              <DateField source="createdAt" />
              <DateField source="updatedAt" />
            </SimpleShowLayout>
          </ShowView>
        );
      }}
    </ShowController>
  );
};

const PostPagination = props => {
  const {total} = useListContext()
  console.log('total', total)
  return (<Pagination rowsPerPageOptions={[25, 50, 100,total]} {...props} />)
};

export const CustomerList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List
      {...props}
      sort={{ field: "createdAt", order: "DESC" }}
      exporter={false}
      pagination={<PostPagination/>}
    >
      <Datagrid rowClick="show">
        <TextField source="code" />
        <BilingualField source="name" />
        <ReferenceField
          label="Group"
          source="group.id"
          reference="CustomerGroup"
          link="show"
        >
          <TextField source="name" />
        </ReferenceField>
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
