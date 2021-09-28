import React from "react";
import {
  useNotify,
  Datagrid,
  TextField,
  FormDataConsumer,
  useTranslate,
  NumberField,
} from "react-admin";
import Grid from "@material-ui/core/Grid";
import { Field } from "react-final-form";
import gql from "graphql-tag";
import ItemAutocomplete from "./ItemAutocomplete";
import ProductAutocomplete from "./ProductAutocomplete";
import ShowText from "../../../components/Shows/ShowText";
import { useQuery } from "@apollo/react-hooks";
import BilingualField from "../../../components/BilingualField";
import Chip from "@material-ui/core/Chip";
import InfiniteScroll from "react-infinite-scroller";
import { List, Avatar, Button, Skeleton } from "antd";

const GET_INVOICE = gql`
  query invoice($where: InvoiceWhereUniqueInput!) {
    invoice(where: $where) {
      salesOrder {
        id
        products {
          id
          quantity
          product {
            id
            code
            nameChi
            nameEn
          }
        }
      }
    }
  }
`;

const ChipsArrayField = ({ source, record = {}, label, onDelete }) => {
  return (
    <React.Fragment>
      {record[source] &&
        record[source].map((item) => (
          <Chip
            key={`chip-${item.itemId}`}
            // label={`${item.label || "No label"} from ${item.warehouseName}`}
            label={`${item.label || "No label"}`}
            onDelete={() => onDelete(item)}
            color="primary"
          />
        ))}
    </React.Fragment>
  );
};

export default () => {
  return (
    <Field name="items">
      {({ input }) => {
        const translate = useTranslate();
        const { value, name, onChange } = input;
        if (!value) {
          onChange([]);
        }
        const handleChange = (inventoryItem) => {
          // check already exists
          if (value.map((v) => v.itemId).includes(inventoryItem.id)) {
            return;
          }
          onChange([
            ...value,
            {
              itemId: inventoryItem.id,
              productId: inventoryItem.product.id,
              productCode: inventoryItem.product.code,
              productNameEn: inventoryItem.product.nameEn,
              productNameChi: inventoryItem.product.nameChi,
              // warehouseId: inventoryItem.warehouse.id,
              // warehouseName: inventoryItem.warehouse.name,
              label: inventoryItem.label,
              expiryDate: inventoryItem.expiryDate,
              boxNum: 1,
            },
          ]);
        };

        const handleDeleteChange = (item) => {
          onChange(value.filter((v) => v.itemId !== item.itemId));
        };

        return (
          <FormDataConsumer subscription={{ values: true }}>
            {({ formData }) => {
              console.log("formData", formData);
              const { invoiceId, items } = formData;
              const notify = useNotify();
              // request invoice info
              const { data } = useQuery(GET_INVOICE, {
                variables: { where: { id: invoiceId } },
              });
              // preparing data
              const products = data ? data.invoice.salesOrder.products : [];
              console.log("fetching date here:", products);
              const record = products.reduce((results, p) => {
                // flatten product
                const { product, ...other } = p;
                const quantity = !!results[product.id]
                  ? results[product.id].quantity
                  : 0;
                console.log("quantity!!!: ", quantity);
                results[product.id] = {
                  ...product,
                  ...other,
                  quantity: p.quantity + quantity,
                };
                return results;
              }, {});
              // merge selected items
              items.forEach((item) => {
                const { productId } = item;
                if (!record[productId]) {
                  notify("deliveryNote.noNeedThisProduct", "info");
                  return;
                }
                const selected = record[productId].selected || [];
                record[productId].selected = [...selected, item];
                record[productId].selectedNum =
                  record[productId].selected.length;
              });
              console.log("record: ", record);

              return (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <ShowText label={translate("common.addNew")}>
                      <ItemAutocomplete
                        onChange={handleChange}
                        placeholder="search by label..."
                        products={products}
                      />
                    </ShowText>
                  </Grid>
                  <Grid item xs={6} style={{ marginTop: 29 }}>
                    <ProductAutocomplete
                      onChange={handleChange}
                      placeholder="search by product no..."
                      productIds={Object.keys(record)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Datagrid
                      data={record}
                      ids={Object.keys(record)}
                      resource="DeliveryNote"
                      basePath="/DeliveryNote"
                      currentSort={{ field: "code", order: "ASC" }}
                    >
                      <TextField source="code" label="Delivery Note No." />
                      <BilingualField source="name" />
                      <NumberField source="quantity" />
                      <ChipsArrayField
                        source="selected"
                        onDelete={handleDeleteChange}
                      />
                      <NumberField
                        source="selectedNum"
                        label="Selected quantity"
                      />
                    </Datagrid>
                  </Grid>
                </Grid>
              );
            }}
          </FormDataConsumer>
        );
      }}
    </Field>
  );
};
