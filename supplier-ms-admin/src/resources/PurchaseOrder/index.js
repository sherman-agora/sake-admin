import React from "react";
import {
  List,
  Datagrid,
  DeleteButton,
  TextField,
  DateField,
  NumberField,
  useTranslate,
  Edit,
  SimpleForm,
  TextInput,
  required,
  DateInput,
  SelectInput,
  FormDataConsumer,
  FunctionField,
  useListContext,
  Pagination
} from "react-admin";
import PurchaseOrderCreate from "./Create";
import { PurchaseOrderShow } from "./Show";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DeleteDialog from "../../utils/deleteDialog";

const redirect = () => "/PurchaseOrder";

export { PurchaseOrderCreate, PurchaseOrderShow };

export const PurchaseOrderEdit = (props) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  return (
    <Edit {...props}>
      <SimpleForm variant="standard">
        <TextInput
          source="code"
          validate={required()}
          label="Purchase Order No."
        />
        <DateInput source="expectedDeliveryAt" />
        <SelectInput
          source="state"
          label="Status"
          choices={[
            { id: "DRAFT", name: translate("common.draft") },
            { id: "PENDING", name: translate("common.pending") },
            { id: "CONFIRMED", name: translate("common.confirmed") },
            // { id: 'APPROVED', name: translate('common.approved') },
            // { id: 'SENT', name: translate('common.sent') },
            // { id: 'ACKED', name: translate('common.acked') },
            // { id: 'SHIPPED', name: translate('common.shipped') },
            // { id: 'ARRIVED', name: translate('common.arrived') },
            // { id: 'RECEIVED', name: translate('common.received') },
            // { id: 'DELETED', name: translate('common.deleted') },
          ]}
        />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              setBreadcrumbs([
                { url: "/PurchaseOrder", label: "Purchase Order" },
                {
                  url: `/PurchaseOrder/${formData.id}`,
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

const PostPagination = props => {
  const {total} = useListContext()
  console.log('total', total)
  return (<Pagination rowsPerPageOptions={[25, 50, 100,total]} {...props} />)
};

export const PurchaseOrderList = (props) => {
  const dispatch = useDispatch();
  dispatch(
    setBreadcrumbs([{ url: "/PurchaseOrder", label: "Purchase Order" }])
  );
  return (
    <List
      {...props}
      exporter={false}
      filterDefaultValues={{ state_not: "DELETED" }}
      sort={{ field: "createdAt", order: "DESC" }}
      pagination={<PostPagination/>}
    >
      <Datagrid rowClick="show">
        <TextField source="code" label="Purchase Order No." />
        <NumberField
          source="totalPrice"
          options={{ style: "currency", currency: "HKD" }}
        />
        <DateField source="expectedDeliveryAt" />
        <TextField source="state" label="Status" />
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
