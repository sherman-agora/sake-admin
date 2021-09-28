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
  ReferenceField,
  FunctionField,
  CheckboxGroupInput,
  SelectInput,
  ReferenceInput,
  DateField,
  useListContext,
  Pagination
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import BilingualField from "../../components/BilingualField";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/CustomerShop";
const breadcrumbBase = { url: "/CustomerShop", label: "CustomerShop" };
const optionRenderer = (customer) => `${customer.code} ${customer.nameChi}`;

const GET_CUSTOMER = gql`
  query customers($where: CustomerWhereInput) {
    customers(where: $where) {
      id
    }
  }
`;
export const CustomerShopCreate = (props) => {
  const { loading: fetching, data } = useQuery(GET_CUSTOMER, {});
  console.log("data", data && data);
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/CustomerShop/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm variant="standard" redirect={redirect}>
        <ReferenceInput
          label="Customer"
          source="customer.id"
          reference="Customer"
          perPage={data && data.customers.length}
        >
          <SelectInput optionText={optionRenderer} validate={required()} />
        </ReferenceInput>
        <TextInput label="Shop No." source="code" validate={required()} />
        <TextInput source="nameChi" validate={required()} />
        <TextInput source="nameEn" />
        <TextInput source="phone" />
        <TextInput source="deliverAddress" validate={required()} />
        <CheckboxGroupInput
          source="deliveryDay"
          choices={[
            { id: 0, name: "Sunday" },
            { id: 1, name: "Monday" },
            { id: 2, name: "Tuesday" },
            { id: 3, name: "Wednesday" },
            { id: 4, name: "Thursday" },
            { id: 5, name: "Friday" },
            { id: 6, name: "Saturday" },
          ]}
        />
      </SimpleForm>
    </Create>
  );
};

export const CustomerShopEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard">
        <TextInput source="nameChi" />
        <TextInput source="nameEn" />
        <TextInput source="phone" />
        <TextInput source="deliverAddress" />
        <CheckboxGroupInput
          source="deliveryDay"
          choices={[
            { id: 0, name: "Sunday" },
            { id: 1, name: "Monday" },
            { id: 2, name: "Tuesday" },
            { id: 3, name: "Wednesday" },
            { id: 4, name: "Thursday" },
            { id: 5, name: "Friday" },
            { id: 6, name: "Saturday" },
          ]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/CustomerShop/${formData.id}`,
                  label: `Edit: ${formData.nameChi}`,
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

export const CustomerShopShow = (props) => {
  const dispatch = useDispatch();
  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const id = controllerProps.record ? controllerProps.record.id : "";
        dispatch(
          setBreadcrumbs([
            breadcrumbBase,
            { url: `/CustomerShop/${id}/show`, label: `Details` },
          ])
        );
        return (
          <ShowView {...props} {...controllerProps}>
            <SimpleShowLayout>
              <ReferenceField
                label="Customer"
                source="customer.id"
                reference="Customer"
                link={(customer, referece) =>
                  `/Customer/${customer.customer.id}/show`
                }
              >
                <BilingualField source="name" />
              </ReferenceField>
              <TextField label="Shop No." source="code" />
              <TextField source="nameChi" />
              <TextField source="nameEn" />
              <TextField source="phone" />
              <TextField label="Deliver Address" source="deliverAddress" />
              <FunctionField
                label="Delivery Day"
                source="deliveryDay"
                render={(shop) =>
                  shop.deliveryDay.map(
                    (day, index) =>
                      `${getWeekDay(day)}${
                        index === shop.deliveryDay.length - 1 ? "." : ","
                      }`
                  )
                }
              />
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

export const CustomerShopList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List {...props } title="Customer Shop" exporter={false} pagination={<PostPagination/>} >
      <Datagrid rowClick="show">
        <TextField label="Shop No." source="code" />
        <TextField source="nameChi" />
        <TextField source="deliverAddress" />
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
