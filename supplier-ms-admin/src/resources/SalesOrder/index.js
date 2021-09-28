import React from "react";
import {
  Datagrid,
  DateField,
  EditButton,
  FunctionField,
  List,
  NumberField,
  ReferenceField,
  TextField,
  useListContext,
  Pagination
} from "react-admin";
import { useDispatch } from "react-redux";
import BilingualField from "../../components/BilingualField";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";
import SalesOrderCreate from "./Create";
import { SalesOrderEdit } from "./Edit";
import { SalesOrderShow } from "./Show";

export { SalesOrderCreate, SalesOrderShow, SalesOrderEdit };

const StatusEditButton = ({ record, props, permissions }) =>
  record.state !== "PAID" ? (
    <EditButton basePath={props.basePath} record={record} />
  ) : null;
const StatusDeleteButton = ({ record, props, permissions }) =>
  record.state !== "PAID" ? (
    <DeleteDialog record={record} props={props} />
  ) : null;
// const StatusEditButton = ({ record, props, permissions }) => (record.state !== "PAID" || permissions === "admin" ? <EditButton basePath={props.basePath} record={record} /> : null);
// const StatusDeleteButton = ({ record, props, permissions }) => (record.state !== "PAID" || permissions === "admin" ? <DeleteButton basePath={props.basePath} record={record} resource={props.resource} /> : null);
const PostPagination = props => {
  const {total} = useListContext()
  console.log('total', total)
  return (<Pagination rowsPerPageOptions={[25, 50, 100,total]} {...props} />)
};

export const SalesOrderList = ({ permissions, ...props }) => {
  console.log(props);
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([{ url: "/SalesOrder", label: "Sales Order" }]));
  var state;

  return (
    <List
      {...props}
      exporter={false}
      pagination={<PostPagination />}
      filterDefaultValues={{ state_not: "DELETED" }}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="code" label="Sales Order No." />
        <ReferenceField
          label="Customer"
          source="shop.id"
          reference="CustomerShop"
        >
          <ReferenceField
            label="Customer"
            source="customer.id"
            reference="Customer"
            link={(shop, referece) => `/Customer/${shop.customer.id}/show`}
          >
            <BilingualField source="name" />
          </ReferenceField>
        </ReferenceField>
        <ReferenceField
          label="Shop"
          source="shop.id"
          reference="CustomerShop"
          link="show"
        >
          <BilingualField source="name" />
        </ReferenceField>
        <NumberField
          label="Grand total price"
          source="grandTotal"
          options={{ style: "currency", currency: "HKD" }}
        />
        <TextField source="state" />
        <DateField source="createdAt" />
        <DateField source="updatedAt" />
        <FunctionField
          label="remark"
          render={(record) => (record.remark ? "✍️" : "")}
        />

        <FunctionField
          render={(record) => (
            <StatusEditButton
              record={record}
              props={props}
              permissions={permissions}
            />
          )}
        />
        <FunctionField
          label="delete"
          render={(record) => (
            <StatusDeleteButton
              record={record}
              props={props}
              permissions={permissions}
            />
          )}
        />
      </Datagrid>
    </List>
  );
};
