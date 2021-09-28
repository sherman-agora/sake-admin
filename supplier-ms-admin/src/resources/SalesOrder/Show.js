import React from "react";
import { useHistory } from "react-router-dom";
import {
  DateField,
  NumberField,
  EditButton,
  Datagrid,
  ReferenceField,
  ReferenceArrayField,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate,
  ShowController,
  ShowView,
  DeleteButton,
  SelectField,
  FunctionField,
} from "react-admin";
import { Add, Edit, Print } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { Grid, Menu, MenuItem, Button } from "@material-ui/core";
import BilingualField from "../../components/BilingualField";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import SCGenerator from "../../utils/generateSC";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
import DeleteDialog from "../../utils/deleteDialog";

const GET_SC = gql`
  query salesOrder($where: SalesOrderWhereUniqueInput!) {
    salesOrder(where: $where) {
      id
      code
      subtotal
      grandTotal
      discountAmount
      discount
      couponDiscount
      state
      shippingDate
      shop {
        phone
        nameEn
        deliverAddress
        customer {
          code
          billingAddress
          mobile
          nameEn
          paymentMethod
          wholesalePlan
        }
      }
      remark
      products {
        id
        totalPrice
        discountAmount
        wholeSalePrice
        product {
          code
          nameEn
          nameChi
          id
          code
        }
        price
        quantity
      }
    }
  }
`;
const useStyles = makeStyles({
  remark: { wordWrap: "break-word", width: "100%" },
});

export const SalesOrderShow = ({ permissions, ...props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const translate = useTranslate();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  console.log("SalesOrder Show", props);
  const toEdit = () => {
    const { id } = props;
    history.push(`/SalesOrder/${id}/edit`);
  };
  const { loading, data } = useQuery(GET_SC, {
    variables: { where: { id: props.id } },
  });
  const onEditItem = (po) => (e) => {
    console.log(po);
    console.log(e);
  };
  console.log("dataHERE!!:", data);

  const toCreateItem = () => {
    const { id } = props;
    history.push("/SalesOrderItem/create", {
      record: { salesOrder: { id }, customer: data.salesOrder.shop.customer },
    });
  };

  // const isPaid =
  //   (data && data.salesOrder.state !== "PAID") || permissions === "admin";
  let isPaid = true;
  isPaid = data && data.salesOrder.state === "PAID";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
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
              onClick={SCGenerator(data)}
              disabled={loading}
            >
              <Print />
              &nbsp;{translate("common.print")}
            </Button>
          ) : null}
        </Typography>
        <ShowController title="Sales Order Details" {...props}>
          {(controllerProps) => {
            const label = controllerProps.record
              ? controllerProps.record.code
              : "";
            const id = controllerProps.record ? controllerProps.record.id : "";
            dispatch(
              setBreadcrumbs([
                { url: "/SalesOrder", label: "Sales Order" },
                { url: `/SalesOrder/${id}/show`, label: `Details: ${label}` },
              ])
            );
            return (
              <ShowView {...controllerProps}>
                <SimpleShowLayout>
                  <ReferenceField
                    label="Customer"
                    source="shop.id"
                    reference="CustomerShop"
                  >
                    <ReferenceField
                      label="Customer"
                      source="customer.id"
                      reference="Customer"
                      link={(shop, referece) =>
                        `/Customer/${shop.customer.id}/show`
                      }
                    >
                      <BilingualField source="name" />
                    </ReferenceField>
                  </ReferenceField>
                  <ReferenceField
                    label="Wholesale plan"
                    source="shop.id"
                    reference="CustomerShop"
                    link={false}
                  >
                    <ReferenceField
                      label="Customer"
                      source="customer.id"
                      reference="Customer"
                      link={false}
                    >
                      <TextField source="wholesalePlan" />
                    </ReferenceField>
                  </ReferenceField>
                  <ReferenceField
                    label="Shop"
                    source="shop.id"
                    reference="CustomerShop"
                    link="show"
                  >
                    <TextField source="code" />
                  </ReferenceField>
                  <TextField source="code" label="Sales Order No." />
                  <TextField
                    source="shippingDate"
                    label="Sales Order Shipping Date"
                  />
                  <TextField
                    className={classes.remark}
                    multiline
                    source="remark"
                    label="Remarks"
                  />
                  <DateField source="actualDate" />
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
          <Typography variant="h6">Status</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <TextField
                source="state"
                addLabel={false}
                label={translate("common.status")}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Subtotal Price</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="subtotal"
                addLabel={false}
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Discount Amount</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="discountAmount"
                addLabel={false}
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        {!!data ? (
          <Grid item>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              More Detail
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Grid container spacing={6} justify="space-between">
                  <Grid item>
                    <Typography variant="inherit">
                      Order Special offer
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="inherit">
                      {`HK$${data.salesOrder.discount}`}
                    </Typography>
                  </Grid>
                </Grid>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Grid container spacing={6} justify="space-between">
                  <Grid item>
                    <Typography variant="inherit">Coupon Cash</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="inherit">
                      {`HK$${data.salesOrder.couponDiscount}`}
                    </Typography>
                  </Grid>
                </Grid>
              </MenuItem>
              {data.salesOrder.products.map((item) => (
                <MenuItem onClick={handleClose}>
                  <Grid container spacing={6} justify="space-between">
                    <Grid item>
                      <Typography variant="inherit">
                        {item.product.code}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="inherit">
                        {`HK$${Math.round(item.discountAmount * 100) / 100}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        ) : null}
        <Grid item>
          <Typography variant="h6">Grand Total Price</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="grandTotal"
                addLabel={false}
                options={{ style: "currency", currency: "HKD" }}
              />
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
                <TextField source="code" label="Invoice No." />
              </ReferenceField>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          {translate("salesOrder.products")}&nbsp;
          {!isPaid ? (
            <Button color="primary" size="small" onClick={toCreateItem}>
              <Add />
              &nbsp;{translate("common.create")}
            </Button>
          ) : null}
        </Typography>
        <Show actions={<React.Fragment />} {...props}>
          <ReferenceArrayField
            reference="SalesOrderItem"
            source="productsIds"
            addLabel={false}
          >
            <Datagrid {...props}>
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
              {!isPaid ? <EditButton /> : null}
              {!isPaid ? (
                <FunctionField
                  render={(record) => (
                    <DeleteDialog
                      record={record}
                      props={{
                        ...props,
                        basePath: `/SalesOrder/${props.id}/show`,
                        resource: "SalesOrderItem",
                      }}
                      // permissions={permissions}
                    />
                  )}
                />
              ) : null}
            </Datagrid>
          </ReferenceArrayField>
        </Show>
      </Grid>
    </Grid>
  );
};
