import { useHistory } from "react-router-dom";
import {
  ChipField,
  DateField,
  NumberField,
  EditButton,
  Datagrid,
  ReferenceField,
  ReferenceArrayField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TopToolbar,
  useTranslate,
  ShowController,
  ShowView,
} from "react-admin";
import Button from "@material-ui/core/Button";
import { Edit, Print } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";

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

export const ProductShow = (props) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const history = useHistory();

  const toEdit = () => {
    const { basePath, id } = props;
    history.push(`${basePath}/${id}/edit`);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6">
          Basic Information&nbsp;
          <Button color="primary" size="small" onClick={toEdit}>
            <Edit />
            &nbsp;{translate("common.edit")}
          </Button>
        </Typography>
        <ShowController
          title="Product Details"
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
                { url: "/Product", label: "Product" },
                { url: `/Product/${id}/show`, label: `Details: ${label}` },
              ])
            );
            return (
              <ShowView {...controllerProps}>
                <SimpleShowLayout>
                  <TextField source="code" label="Product No." />
                  <TextField source="nameEn" />
                  <TextField source="nameChi" />
                  <TextField source="discount" />
                  <TextField source="shortDescription" />
                  <TextField source="longDescription" />
                  {/*<ImageField source="images" src="src" title="title" />*/}
                  <TextField source="sku" />
                  <TextField source="upc" />
                  <TextField source="minOrderQuantity" />
                  <TextField source="minStockLevel" />
                  <DateField source="onlineDate" />
                  <DateField source="offlineDate" />
                  <ReferenceArrayField
                    label="Categories"
                    reference="ProductCategory"
                    source="categoriesIds"
                  >
                    <SingleFieldList>
                      <ChipField source="nameChi" />
                    </SingleFieldList>
                  </ReferenceArrayField>
                </SimpleShowLayout>
              </ShowView>
            );
          }}
        </ShowController>
      </Grid>
      <Grid item container xs={3} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Cost</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="cost"
                addLabel={false}
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Wholesales Prices</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="wholeSalePrice1"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="wholeSalePrice2"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="wholeSalePrice3"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="wholeSalePrice4"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="wholeSalePrice5"
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Retails Prices</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <NumberField
                source="retailPrice1"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="retailPrice2"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="retailPrice3"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="retailPrice4"
                options={{ style: "currency", currency: "HKD" }}
              />
              <NumberField
                source="retailPrice5"
                options={{ style: "currency", currency: "HKD" }}
              />
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
      <Grid item container xs={3} direction="column" spacing={2}>
        <Grid item>
          <Typography variant="h6">Total Stock</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <TextField source="quantity" addLabel={false} />
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Warehouse Summary</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceArrayField
                reference="WarehouseSummary"
                source="warehouseSummariesIds"
              >
                <Datagrid>
                  <ReferenceField
                    label="Warehouse"
                    source="warehouse.id"
                    reference="Warehouse"
                  >
                    <TextField source="name" />
                  </ReferenceField>
                  <TextField source="quantity" />
                </Datagrid>
              </ReferenceArrayField>
            </SimpleShowLayout>
          </Show>
        </Grid>
        <Grid item>
          <Typography variant="h6">Expiry Date Summary</Typography>
          <Show actions={<React.Fragment />} {...props}>
            <SimpleShowLayout>
              <ReferenceArrayField
                reference="ExpiryDateSummary"
                source="expiryDateSummariesIds"
              >
                <Datagrid>
                  <DateField source="expiryDate" />
                  <TextField source="quantity" />
                </Datagrid>
              </ReferenceArrayField>
            </SimpleShowLayout>
          </Show>
        </Grid>
      </Grid>
    </Grid>
  );
};
