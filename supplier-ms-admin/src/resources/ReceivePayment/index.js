import React from "react";
import {
  Edit,
  SimpleForm,
  List,
  Datagrid,
  Show,
  Create,
  ReferenceInput,
  DeleteButton,
  TextField,
  DateField,
  SelectInput,
  DateTimeInput,
  required,
  ReferenceField,
  DateInput,
  SimpleShowLayout,
  TextInput,
  FormDataConsumer,
  ShowController,
  ShowView,
  ReferenceFieldController,
  FunctionField,
  useListContext,
  Pagination
} from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import BilingualField from "../../components/BilingualField";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/ReceivePayment";
const breadcrumbBase = { url: "/ReceivePayment", label: "Receive Payment" };

export const ReceivePaymentCreate = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([
      breadcrumbBase,
      { url: "/ReceivePayment/create", label: "Create New" },
    ])
  );
  return (
    <Create {...props}>
      <SimpleForm redirect={redirect}>
        <ReferenceInput
          label="Invoice"
          source="invoiceId"
          reference="Invoice"
          filter={{ state: "DELIVERED" }}
          sort={{ field: "createdAt", order: "DESC" }}
        >
          <SelectInput optionText="code" label="Receive Payment No." />
        </ReferenceInput>
        <SelectInput
          source="paymentMethod"
          validate={required()}
          choices={[
            { id: "COD", name: "Cash on Delivery" },
            { id: "CREDIT", name: "Credit" },
            { id: "DEBIT", name: "Debit" },
          ]}
        />
        <DateInput source="paidAt" validate={required()} />
      </SimpleForm>
    </Create>
  );
};

export const ReceivePaymentEdit = (props) => {
  const dispatch = useDispatch();
  return (
    <Edit {...props}>
      <SimpleForm redirect={redirect}>
        <ReferenceInput label="Invoice" source="invoiceId" reference="Invoice">
          <SelectInput optionText="code" label="Receive Payment No." />
        </ReferenceInput>
        <SelectInput
          source="paymentMethod"
          validate={required()}
          choices={[
            { id: "COD", name: "Cash on Delivery" },
            { id: "Credit", name: "Credit" },
            { id: "Debit", name: "Debit" },
          ]}
        />
        <DateTimeInput source="paidAt" validate={required()} />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                breadcrumbBase,
                { url: `/ReceivePayment/${formData.id}`, label: "Edit" },
              ])
            );
            return null;
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export const ReceivePaymentShow = (props) => {
  const dispatch = useDispatch();
  return (
    <ShowController {...props}>
      {(controllerProps) => {
        const label = "Details";
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
              <ReferenceField
                label="Invoice"
                reference="Invoice"
                source="invoice.id"
              >
                <TextField source="code" label="Receive Payment No." />
              </ReferenceField>
              <DateField source="paidAt" />
              <TextField source="paymentMethod" />
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

export const ReceivePaymentList = (props) => {
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  return (
    <List
      {...props}
      filterDefaultValues={{ state_not: "DELETED" }}
      sort={{ field: "createdAt", order: "DESC" }}
      exporter={false}
      pagination={<PostPagination/>}
    >
      <Datagrid rowClick="show">
        <ReferenceField label="Invoice" reference="Invoice" source="invoice.id">
          <TextField source="code" />
        </ReferenceField>
        <ReferenceFieldController
          label="Customer"
          reference="Invoice"
          source="invoice.id"
          link={false}
        >
          {({ referenceRecord, ...props }) => (
            <ReferenceFieldController
              resource="Invoice"
              basePath="/Invoice"
              record={referenceRecord || {}}
              reference="SalesOrder"
              source="salesOrder.id"
              link={false}
            >
              {({ referenceRecord: ref2, ...props }) => (
                <ReferenceFieldController
                  resource="SalesOrder"
                  basePath="/SalesOrder"
                  record={ref2 || {}}
                  reference="CustomerShop"
                  source="shop.id"
                  link={false}
                >
                  {({ referenceRecord: ref3, ...props }) => (
                    <ReferenceField
                      resource="CustomerShop"
                      basePath="/CustomerShop"
                      record={ref3 || {}}
                      reference="Customer"
                      source="customer.id"
                      link="show"
                    >
                      <BilingualField source="name" />
                    </ReferenceField>
                  )}
                </ReferenceFieldController>
              )}
            </ReferenceFieldController>
          )}
        </ReferenceFieldController>
        <DateField source="paidAt" />
        <TextField source="paymentMethod" />
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
