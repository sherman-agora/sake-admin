import { useHistory } from "react-router-dom";
import {
  DateField,
  NumberField,
  FunctionField,
  Datagrid,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  useTranslate,
  ShowController,
  ShowView,
  List,
} from "react-admin";
import Button from "@material-ui/core/Button";
import { Add, Edit } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Grid from "@material-ui/core/Grid";
import BilingualField from "../../components/BilingualField";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";
import { useState } from "react";

// const ProductShowActions = ({ basePath, data, resource }) => {
//   const translate = useTranslate();
//   const print = (...props) => {
//     console.log('Print Props', props);
//   };
//   return (
//     <TopToolbar>
//       <EditButton basePath={basePath} record={data} />
//       <Button color="primary" size="small" onClick={print}>
//         <Print />&nbsp;
//         {translate('common.print')}
//       </Button>
//     </TopToolbar>
//   );
// };

export const PurchaseOrderShow = (props) => {
  const [state, setState] = useState("ARRIVED");
  const dispatch = useDispatch();
  const translate = useTranslate();
  const history = useHistory();
  const toEdit = () => {
    const { id } = props;
    history.push(`/PurchaseOrder/${id}/edit`);
  };
  const toEditItem = (record) => () => {
    console.log("record", record);
    history.push(`/PurchaseOrderItem/${record.id}`);
  };
  const toCreateItem = () => {
    const { id } = props;
    history.push("/PurchaseOrderItem/create", {
      record: { purchaseOrder: { id } },
    });
  };
  const onFetchState = (record) => {
    console.log("record: ", record);
    setState(record.state);
    return record.state;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Typography variant="h6">
          {translate("common.information")}&nbsp;
          <Button
            color="primary"
            size="small"
            onClick={toEdit}
            disabled={state && state === "ARRIVED"}
          >
            <Edit />
            &nbsp;{translate("common.edit")}
          </Button>
        </Typography>
        <ShowController
          title="Purchase Order Details"
          actions={<React.Fragment />}
          {...props}
        >
          {(controllerProps) => {
            const label = controllerProps.record
              ? controllerProps.record.code
              : "";
            const id = controllerProps.record ? controllerProps.record.id : "";
            dispatch(
              setBreadcrumbs([
                { url: "/PurchaseOrder", label: "Purchase Order" },
                {
                  url: `/PurchaseOrder/${id}/show`,
                  label: `Details: ${label}`,
                },
              ])
            );
            return (
              <ShowView {...controllerProps}>
                <SimpleShowLayout>
                  <ReferenceField
                    label="Supplier"
                    source="supplier.id"
                    reference="Supplier"
                    link={false}
                  >
                    <TextField source="name" />
                  </ReferenceField>
                  <TextField source="code" label="Supplier No." />
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
              {/* <TextField
                source="state"
                addLabel={false}
                label={translate("common.status")}
              /> */}
              <FunctionField
                addLabel={false}
                render={(record) => onFetchState(record)}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Cost</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="totalPrice"
                addLabel={false}
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Expected Delivery Date</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <DateField addLabel={false} source="expectedDeliveryAt" />
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          {translate("purchaseOrder.products")}&nbsp;
          <Button
            color="primary"
            size="small"
            onClick={toCreateItem}
            disabled={state && state === "ARRIVED"}
          >
            <Add />
            &nbsp;{translate("common.create")}
          </Button>
        </Typography>
        <ShowController
          title="Products"
          actions={<React.Fragment />}
          {...props}
        >
          {(controllerProps) => {
            if (!controllerProps.record) {
              return null;
            }
            const id = controllerProps.record ? controllerProps.record.id : "";
            return (
              <List
                resource="PurchaseOrderItem"
                hasCreate={false}
                hasEdit={false}
                hasShow={false}
                hasList={true}
                exporter={false}
                basePath="/PurchaseOrderItem"
                filter={{ purchaseOrder: { id } }}
              >
                <Datagrid>
                  <ReferenceField
                    label="#"
                    source="product.id"
                    reference="Product"
                  >
                    <TextField source="code" label="Product No." />
                  </ReferenceField>
                  <ReferenceField
                    label="Product Name"
                    source="product.id"
                    reference="Product"
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
                  <FunctionField
                    render={(record) => (
                      <Button
                        color="primary"
                        size="small"
                        disabled={state && state == "ARRIVED"}
                        onClick={toEditItem(record)}
                      >
                        <Edit />
                        &nbsp;{translate("common.edit")}
                      </Button>
                    )}
                  />
                </Datagrid>
              </List>
            );
          }}
        </ShowController>
      </Grid>
    </Grid>
  );
};
