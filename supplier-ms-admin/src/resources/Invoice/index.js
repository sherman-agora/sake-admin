import React from "react";
import {
  Edit,
  SimpleForm,
  List,
  Datagrid,
  EditButton,
  DeleteButton,
  TextField,
  NumberField,
  DateField,
  TextInput,
  ReferenceField,
  required,
  DateInput,
  SelectInput,
  FormDataConsumer,
  FunctionField,
  useGetOne,
  DateTimeInput,
  Filter,
  useListContext,
  Pagination
} from "react-admin";
import InvoiceCreate from "./Create";
import { InvoiceShow } from "./Show";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/Invoice";

export { InvoiceCreate, InvoiceShow };
const breadcrumbBase = { url: "/Invoice", label: "Invoice" };

export const InvoiceEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <TextInput source="code" validate={required()} label="Invoice No." />
        <DateInput source="shipmentDate" />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                {
                  url: `/Invoice/${formData.id}`,
                  label: `Edit: ${formData.code}`,
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
const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Code" source="code" />
    <DateTimeInput source="createdAt_gt" label="FromDate" />
    <DateTimeInput source="createdAt_lt" label="ToDate" />
  </Filter>
);
const PostPagination = props => {
  const {total} = useListContext()
  console.log('total', total)
  return (<Pagination rowsPerPageOptions={[25, 50, 100,total]} {...props} />)
};


export const InvoiceList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List
      {...props}
      exporter={false}
      pagination={<PostPagination />}
      filterDefaultValues={{ state_not: "DELETED" }}
      sort={{ field: "createdAt", order: "DESC" }}
      filters={<PostFilter />}
    >
      <Datagrid rowClick="show">
        <TextField source="code" label="Invoice No." />
        <DateField source="shipmentDate" />
        <NumberField
          source="totalPrice"
          options={{ style: "currency", currency: "HKD" }}
        />
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
