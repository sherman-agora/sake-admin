import { useHistory } from "react-router-dom";
import {
  DateField,
  NumberField,
  Datagrid,
  ReferenceField,
  Show,
  ReferenceArrayField,
  SimpleShowLayout,
  TextField,
  useTranslate,
  ReferenceManyField,
} from "react-admin";
import Button from "@material-ui/core/Button";
import { Edit, Print } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Grid from "@material-ui/core/Grid";
import BilingualField from "../../components/BilingualField";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import INVGenerator from "../../utils/generateINV";
import SCGenerator from "../../utils/generateSC";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";

const GET_INVOICE = gql`
  query invoice($where: InvoiceWhereUniqueInput!) {
    invoice(where: $where) {
      id
      code
      salesOrder {
        id
        code
        title
        remark
        discountAmount
        couponDiscount
        discount
        grandTotal
        subtotal
        state
        userId
        shop {
          nameEn
          deliverAddress
          phone
          customer {
            id
            code
            nameEn
          }
        }
        products {
          wholeSalePrice
          discountAmount
          id
          totalPrice
          product {
            nameEn
            nameChi
            id
            code
            printInInvoice
          }
          price
          discount
          quantity
        }
        createdAt
        updatedAt
      }
      userId
      state
      paymentStatus
      totalPrice
      title
      remark
      shipmentDate
      createdAt
      updatedAt
      paidAt
    }
  }
`;
export const InvoiceShow = (props) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const history = useHistory();
  const toEdit = () => {
    const { basePath, id } = props;
    history.push(`${basePath}/${id}/edit`);
  };
  const { loading, data } = useQuery(GET_INVOICE, {
    variables: { where: { id: props.id } },
  });
  const label = data && data.invoice.code;
  const id = data && data.invoice.id;
  let isPaid = true;
  if (data) {
    isPaid = data.invoice.salesOrder.state === "PAID";
  }
  dispatch(
    setBreadcrumbs([
      { url: "/Invoice", label: "Invoice" },
      { url: `/Invoice/${id}/show`, label },
    ])
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Typography variant="h6">
          Basic Information&nbsp;
          {!isPaid ? (
            <Button color="primary" size="small" onClick={toEdit}>
              <Edit />
              &nbsp;{translate("common.edit")}
            </Button>
          ) : null}
          <Button
            color="primary"
            size="small"
            onClick={INVGenerator(data)}
            disabled={loading}
          >
            <Print />
            &nbsp;{translate("common.print")}
          </Button>
        </Typography>
        <Show actions={<React.Fragment />} x {...props}>
          <SimpleShowLayout>
            <TextField source="code" label="Invoice No." />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <ReferenceField
              label="Shop Name"
              reference="SalesOrder"
              source="salesOrder.id"
              link="show"
            >
              <ReferenceField
                label="shop"
                reference="CustomerShop"
                source="shop.id"
                link={false}
              >
                <BilingualField source="name" />
              </ReferenceField>
            </ReferenceField>
            <ReferenceField
              label="Shop Phone"
              reference="SalesOrder"
              source="salesOrder.id"
              link={false}
            >
              <ReferenceField
                label="shop"
                reference="CustomerShop"
                source="shop.id"
                link={false}
              >
                <TextField source="phone" />
              </ReferenceField>
            </ReferenceField>
            <ReferenceField
              label="Shop deliver address"
              reference="SalesOrder"
              source="salesOrder.id"
              link={false}
            >
              <ReferenceField
                label="shop"
                reference="CustomerShop"
                source="shop.id"
                link={false}
              >
                <TextField source="deliverAddress" />
              </ReferenceField>
            </ReferenceField>
          </SimpleShowLayout>
        </Show>
      </Grid>
      <Grid item container xs={3} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Total Price</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="totalPrice"
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Shipment Date</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <DateField source="shipmentDate" />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Sales Order</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceField
                label="Sales Order"
                reference="SalesOrder"
                source="salesOrder.id"
                link="show"
              >
                <TextField source="code" label="Sales Order No." />
              </ReferenceField>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item container xs={12} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Items</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <ReferenceField
              label="Products"
              reference="SalesOrder"
              source="salesOrder.id"
            >
              <ReferenceArrayField
                reference="SalesOrderItem"
                source="productsIds"
                addLabel={false}
              >
                <Datagrid>
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
                  <NumberField
                    source="price"
                    options={{ style: "currency", currency: "HKD" }}
                  />
                  <TextField source="quantity" />
                  <NumberField
                    source="totalPrice"
                    options={{ style: "currency", currency: "HKD" }}
                  />
                </Datagrid>
              </ReferenceArrayField>
            </ReferenceField>
          </Show>
        </Grid>
      </Grid>
    </Grid>
  );
};
