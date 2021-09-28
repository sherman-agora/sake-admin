import React from "react";
import {
  Edit,
  SimpleForm,
  List,
  Datagrid,
  Show,
  EditButton,
  DeleteButton,
  TextField,
  DateField,
  ReferenceField,
  FormDataConsumer,
  ReferenceInput,
  SelectInput,
  FunctionField,
  useGetOne,
  useListContext,
  Pagination
} from "react-admin";

import DeliveryNoteCreate from "./Create";
import DeliveryNoteShow from "./Show";
import BilingualField from "../../components/BilingualField";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import { useTranslate } from "react-admin";
import CustomerAutocomplete from "../../components/Inputs/CustomerAutocomplete";
import Grid from "@material-ui/core/Grid";
import DeleteDialog from "../../utils/deleteDialog";

export { DeliveryNoteCreate, DeliveryNoteShow };

const redirect = () => "/DeliveryNote";
const breadcrumbBase = { url: "/DeliveryNote", label: "DeliveryNote" };

export const DeliveryNoteEdit = (props) => {
  console.log(props);
  const dispatch = useDispatch();

  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <ReferenceInput label="Invoice" source="invoice.id" reference="Invoice">
          <SelectInput optionText="code" label="Invoice No." />
        </ReferenceInput>

        <ReferenceField
          label="Sales Order"
          reference="Invoice"
          source="invoice.id"
        >
          <ReferenceField reference="SalesOrder" source="salesOrder.id">
            <TextField source="code" label="Sales Order No." />
          </ReferenceField>
        </ReferenceField>

        <ReferenceField
          label="CustomerShop"
          reference="SalesOrder"
          source="salesOrder.id"
        >
          <ReferenceField
            reference="CustomerShop"
            source="shop.id"
            link={(shop, referece) => `/CustomerShop/${shop.shop.id}/show`}
          >
            <BilingualField source="name" />
          </ReferenceField>
        </ReferenceField>
        <ReferenceField
          label="Customer"
          reference="SalesOrder"
          source="salesOrder.id"
        >
          <ReferenceField source="shop.id" reference="CustomerShop">
            <ReferenceField
              source="customer.id"
              reference="Customer"
              link={(shop, referece) => `/Customer/${shop.customer.id}/show`}
            >
              <BilingualField source="name" />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>

        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/DeliveryNote/${formData.id}`,
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

const StatusButton = ({ record, props, permissions }) => {
  const { data, loaded } = useGetOne("SalesOrder", record.salesOrder.id);
  let isPaid = true;
  if (data) {
    isPaid = data.state === "PAID";
  }
  return !isPaid ? (
    <div>
      <EditButton basePath={props.basePath} record={record} />
      <DeleteButton
        basePath={props.basePath}
        record={record}
        resource={props.resource}
      />
    </div>
  ) : null;
};
const PostPagination = props => {
  const {total} = useListContext()
  console.log('total', total)
  return (<Pagination rowsPerPageOptions={[25, 50, 100,total]} {...props} />)
};

export const DeliveryNoteList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  console.log(props);
  return (
    <List
      {...props}
      pagination={<PostPagination/>}
      filterDefaultValues={{ state_not: "DELETED" }}
      sort={{ field: "createdAt", order: "DESC" }}
      exporter={false}
    >
      <Datagrid rowClick="show">
        <TextField source="code" />
        <ReferenceField
          label="Sales Order"
          reference="SalesOrder"
          source="salesOrder.id"
          link="show"
        >
          <TextField source="code" label="Sales Order No." />
        </ReferenceField>
        <ReferenceField
          label="Invoice"
          reference="Invoice"
          source="invoice.id"
          link="show"
        >
          <TextField source="code" label="Invoice No." />
        </ReferenceField>
        <ReferenceField
          label="Customer"
          reference="SalesOrder"
          source="salesOrder.id"
        >
          <ReferenceField source="shop.id" reference="CustomerShop">
            <ReferenceField
              source="customer.id"
              reference="Customer"
              link={(shop, referece) => `/Customer/${shop.customer.id}/show`}
            >
              <BilingualField source="name" />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>

        <DateField source="createdAt" />
        <DateField source="updatedAt" />

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
