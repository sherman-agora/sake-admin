import { useHistory } from "react-router-dom";
import {
  DateField,
  Datagrid,
  ReferenceField,
  ReferenceFieldController,
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
  useTranslate,
  ShowController,
  ShowView,
  ReferenceManyField,
  TopToolbar,
  EditButton,
  ReferenceArrayField,
  NumberField,
  Pagination,
  DeleteButton,
} from "react-admin";
import Button from "@material-ui/core/Button";
import { Add, Edit, Print, DeleteForever } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Grid from "@material-ui/core/Grid";
import BilingualField from "../../components/BilingualField";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import SCGenerator from "../../utils/generateSC";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import DNGenerator from "../../utils/generateDN";
import DNBLGenerator from "../../utils/generateDNBL";
import DeleteDialog from "../../utils/deleteDialog";

const GET_DN = gql`
  query deliveryNote($where: DeliveryNoteWhereUniqueInput!) {
    deliveryNote(where: $where) {
      id
      code
      invoice {
        code
        shipmentDate
      }
      items {
        product {
          code
          nameEn
          nameChi
          printInDN
          printInLabel
        }
        item {
          label
          expiryDate
        }
        boxNum
      }
      salesOrder {
        shop {
          phone
          deliverAddress
          nameChi
          nameEn
          customer {
            nameChi
            code
            nameEn
            remark
          }
        }
      }
    }
  }
`;

export default ({ permissions, ...props }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const history = useHistory();
  console.log("DeliveryNote Show", props);
  const toEdit = () => {
    const { id } = props;
    history.push(`/DeliveryNote/${id}/edit`);
  };
  const toEditItem = (record) => () => {
    console.log("record: ", record);
    history.push(`/DeliveryItem/${record.id}/edit`, {
      record,
    });
  };
  const toDeleteItem = (record) => () => {
    console.log("record: ", record);
    history.push(`/DeliveryItem/${record.id}/delete`, {
      record,
    });
  };
  const toCreateItem = () => {
    const { id } = props;
    console.log("deliveryNote id : ", id);
    history.push("/DeliveryItem/create", {
      record: { DeliveryNote: { id } },
    });
  };
  const { loading, data: res } = useQuery(GET_DN, {
    variables: { where: { id: props.id } },
  });
  if (res) {
    console.log("res", res.deliveryNote.salesOrder.state);
  }

  const isAdmin = permissions === "admin";
  let isPaid = true;
  if (res) {
    isPaid = res && res.deliveryNote.salesOrder.state === "PAID";
  }

  const PostPagination = (props) => (
    <Pagination rowsPerPageOptions={[10, 25, 50, 100]} {...props} />
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Typography variant="h6">
          {translate("common.information")}&nbsp;
          {!isPaid ? (
            <Button color="primary" size="small" onClick={toEdit}>
              <Edit />
              &nbsp;{translate("common.edit")}
            </Button>
          ) : null}
          {!isPaid ? (
            <Button
              color="primary"
              size="small"
              onClick={DNGenerator(res)}
              disabled={loading}
            >
              <Print />
              &nbsp;{translate("common.print")}
            </Button>
          ) : null}
          {!isPaid ? (
            <Button
              color="primary"
              size="small"
              onClick={DNBLGenerator(res)}
              disabled={loading}
            >
              <Print />
              &nbsp;{translate("deliveryNote.printBoxLabel")}
            </Button>
          ) : null}
        </Typography>
        <ShowController title="Delivery Note Details" {...props}>
          {(controllerProps) => {
            const label = controllerProps.record
              ? controllerProps.record.code
              : "";
            const id = controllerProps.record ? controllerProps.record.id : "";
            dispatch(
              setBreadcrumbs([
                { url: "/DeliveryNote", label: "Delivery Note" },
                { url: `/DeliveryNote/${id}/show`, label: `Details` },
              ])
            );
            return (
              <ShowView {...controllerProps}>
                <SimpleShowLayout>
                  <TextField label="Delivery No." source="code" />
                  <ReferenceField
                    label="Shipment Date"
                    reference="Invoice"
                    source="invoice.id"
                  >
                    <DateField source="shipmentDate" />
                  </ReferenceField>
                  <DateField source="createdAt" />
                  <DateField source="updatedAt" />
                </SimpleShowLayout>
              </ShowView>
            );
          }}
        </ShowController>
      </Grid>
      <Grid item container xs={3} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Customer</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceFieldController
                label="Customer"
                reference="SalesOrder"
                source="salesOrder.id"
                link={false}
              >
                {({ referenceRecord, ...props }) => (
                  <ReferenceField
                    resource="Customer"
                    basePath="/Customer"
                    source="shop.id"
                    reference="CustomerShop"
                    record={referenceRecord || {}}
                    link="show"
                  >
                    <ReferenceField
                      resource="Customer"
                      basePath="/Customer"
                      source="customer.id"
                      reference="Customer"
                      record={referenceRecord || {}}
                      link="show"
                    >
                      <TextField source="nameChi" />
                    </ReferenceField>
                  </ReferenceField>
                )}
              </ReferenceFieldController>
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Sales Order</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceField
                label="Sales Order No."
                reference="SalesOrder"
                source="salesOrder.id"
                link="show"
              >
                <TextField source="code" />
              </ReferenceField>
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Invoice</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceField
                label="Invoice No."
                reference="Invoice"
                source="invoice.id"
                link="show"
              >
                <TextField source="code" />
              </ReferenceField>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item container xs={5} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Products</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceFieldController
                label="Products"
                reference="SalesOrder"
                source="salesOrder.id"
                link={false}
              >
                {({ referenceRecord, ...props }) => (
                  <ReferenceArrayField
                    basePath="/SalesOrder"
                    resource="SalesOrderItem"
                    reference="SalesOrderItem"
                    source="productsIds"
                    record={referenceRecord || {}}
                    addLabel={false}
                  >
                    <Datagrid>
                      <ReferenceField
                        label="#"
                        source="product.id"
                        reference="Product"
                        link={(item, referece) => {
                          // return `/Product/${item.product.id}/show`;
                          return false;
                        }}
                      >
                        <TextField source="code" label="Product No." />
                      </ReferenceField>
                      <ReferenceField
                        label="Product Name"
                        source="product.id"
                        reference="Product"
                        link={(item, referece) => {
                          // return `/Product/${item.product.id}/show`;
                          return false;
                        }}
                      >
                        <BilingualField source="name" />
                      </ReferenceField>
                      <TextField source="quantity" />
                    </Datagrid>
                  </ReferenceArrayField>
                )}
              </ReferenceFieldController>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          Packing
          {!isPaid ? (
            <Button color="primary" size="small" onClick={toCreateItem}>
              <Add />
              &nbsp;{translate("common.create")}
            </Button>
          ) : null}
        </Typography>
        <Show actions={<React.Fragment />} {...props}>
          <ReferenceManyField
            reference="DeliveryItem"
            target="deliveryNote"
            addLabel={false}
            pagination={<PostPagination />}
          >
            <Datagrid>
              <TextField label="Box Num" source="boxNum" />
              <ReferenceField
                label="Label"
                source="item.id"
                reference="InventoryItem"
                link={false}
              >
                <TextField source="label" />
              </ReferenceField>
              <ReferenceField
                label="ExpiryDate"
                source="item.id"
                reference="InventoryItem"
                link={false}
              >
                <DateField source="expiryDate" />
              </ReferenceField>
              <ReferenceField
                label="#"
                source="product.id"
                reference="Product"
                link="show"
              >
                <TextField source="code" label="Product No." />
              </ReferenceField>
              <ReferenceField
                label="Product Name"
                source="product.id"
                reference="Product"
                link="show"
              >
                <BilingualField source="name" />
              </ReferenceField>
              <FunctionField
                render={(record) => (
                  <Button
                    color="primary"
                    size="small"
                    onClick={toEditItem(record)}
                    disabled={isPaid}
                  >
                    <Edit />
                    &nbsp;{translate("common.edit")}
                  </Button>
                )}
              />
              <FunctionField
                render={(record) => (
                  <DeleteDialog
                    record={record}
                    props={{
                      ...props,
                      basePath: `/DeliveryNote/${props.id}/show`,
                      resource: "DeliveryItem",
                    }}
                  />
                )}
              />
              {/* <FunctionField
                render={(record) => (
                  <Button
                    color="primary"
                    size="small"
                    onClick={toDeleteItem(record)}
                    disabled={isPaid}
                  >
                    <DeleteForever />
                    &nbsp;{translate("common.delete")}
                  </Button>
                )}
              /> */}
            </Datagrid>
          </ReferenceManyField>
        </Show>
      </Grid>
    </Grid>
  );
};
