import React, { useCallback, useState, useEffect } from "react";
import {
  NumberInput,
  useNotify,
  ReferenceInput,
  SelectInput,
  DateInput,
  TextInput,
  AutocompleteInput,
  FormDataConsumer,
  required,
  regex,
} from "react-admin";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Add } from "@material-ui/icons";
import { Form } from "react-final-form";
import Typography from "@material-ui/core/Typography";
import sequentialNumber from "../../../utils/sequentialNumber";
import QuantityCheckTable from "./QuantityCheckTable";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import uniqueLabelCheck from "../../../utils/uniqueLabelCheck";

const QUERY_SHIPPING_LABEL = gql`
  query queryShippingItems {
    shippingItems {
      labelFrom
      labelTo
    }
  }
`;

export default ({ formData, setFormData }) => {
  const notify = useNotify();
  const { defaultLabel, setDefaultLabel } = useState("");
  const { purchaseOrder } = formData;
  const { products } = purchaseOrder;
  const { loading, data } = useQuery(QUERY_SHIPPING_LABEL);
  // const [labelList, setLabelList] = useState([]);
  const [labelList, setLabelList] = useState([]);
  // console.log("labelList--outside: ", labelList);

  useEffect(() => {
    console.log("call useUffect: ", data);
    if (data) {
      setLabelList(data.shippingItems);
      console.log("fetching data.....", data.shippingItems);
      console.log("inside", labelList);
    }
  }, [data]);

  const options = products.map((item) => ({
    id: item.id,
    name: item.product.code + " - " + item.product.nameChi,
  }));

  // const onSubmit = useCallback(
  //   (values, form, labelList) => {
  //     console.log("data.shippingItems: ", labelList);
  //     const item = products.find((item) => item.id === values.itemId);
  //     if (!item) {
  //       notify("Please select product first", "error");
  //       return;
  //     }
  //     if (!item.checked) {
  //       item.checked = [];
  //     }
  //     const labelTo = values.labelFrom
  //       ? sequentialNumber.numberAfter(
  //           values.labelFrom,
  //           parseInt(values.exactQuantity, 10) - 1
  //         )
  //       : "";
  //     console.log("start checking:.....");
  //     console.log("data: ", data && data.shippingItems);
  //     // check with backend here
  //     const checking = uniqueLabelCheck({
  //       input: {
  //         labelFrom: values.labelFrom,
  //         labelTo,
  //       },
  //       backendData: data && data.shippingItems,
  //     });

  //     console.log("checking", checking);

  //     item.checked.push({ ...values, labelTo });
  //     setFormData({
  //       ...formData,
  //       purchaseOrder: {
  //         ...purchaseOrder,
  //         products,
  //       },
  //     });
  //     setTimeout(() =>
  //       form.reset({
  //         warehouseId: values.warehouseId,
  //         expiryDate: values.expiryDate,
  //         labelFrom: values.labelFrom
  //           ? sequentialNumber.numberAfter(labelTo)
  //           : "",
  //       })
  //     );
  //   },
  //   [setFormData, formData]
  // );

  const onSubmit = (values, form) => {
    const item = products.find((item) => item.id === values.itemId);
    if (!item) {
      notify("Please select product first", "error");
      return;
    }
    if (!item.checked) {
      item.checked = [];
    }
    const labelTo = values.labelFrom
      ? sequentialNumber.labelNumberAfter(
          values.labelFrom,
          parseInt(values.exactQuantity, 10) - 1
        )
      : "";
    // check with backend here
    const checking = uniqueLabelCheck({
      input: {
        labelFrom: values.labelFrom,
        labelTo,
      },
      backendData: labelList,
    });

    console.log("checking", checking);

    item.checked.push({ ...values, labelTo });
    setFormData({
      ...formData,
      purchaseOrder: {
        ...purchaseOrder,
        products,
      },
    });
    setTimeout(() =>
      form.reset({
        warehouseId: values.warehouseId,
        expiryDate: values.expiryDate,
        labelFrom: values.labelFrom
          ? sequentialNumber.numberAfter(labelTo)
          : "",
      })
    );
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, values, form, submitting, pristine }) => {
        const { quantity, labelFrom } = values;
        if (quantity && labelFrom) {
          console.log(quantity, labelFrom);
        }
        const handleRowClick = (row) => {
          form.change("itemId", row.id);
        };

        const handleRemoveChecked = (i, row) => {
          const item = products.find((p) => p.id === row.id);
          item.checked.splice(i, 1);
          setFormData({
            ...formData,
            purchaseOrder: {
              ...purchaseOrder,
              products,
            },
          });
        };

        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item style={{ flexGrow: 1 }}>
                <AutocompleteInput
                  source="itemId"
                  fullWidth
                  choices={options}
                  validate={required()}
                />
              </Grid>
              <Grid item>
                <ReferenceInput
                  label="Warehouse"
                  source="warehouseId"
                  reference="Warehouse"
                  filterToQuery={() => ({ type: "NORMAL" })}
                >
                  <SelectInput optionText="name" validate={required()} />
                </ReferenceInput>
              </Grid>
              <Grid item>
                <DateInput source="expiryDate" validate={required()} />
              </Grid>
              <Grid item>
                <NumberInput
                  source="exactQuantity"
                  label="Quantity"
                  validate={required()}
                />
              </Grid>
              <Grid item>
                <TextInput
                  source="labelFrom"
                  defaultValue={defaultLabel}
                  validate={regex(
                    /^[A-Z]{2}\d{10}$/,
                    "Format of label: AA0000000000"
                  )}
                />
              </Grid>
              <Grid item>
                <FormDataConsumer>
                  {({ formData, ...rest }) => {
                    const { exactQuantity, labelFrom } = formData;
                    console.log("exactQuantity:", exactQuantity);
                    if (exactQuantity && labelFrom) {
                      return (
                        <Typography variant="body1">
                          {sequentialNumber.labelNumberAfter(
                            labelFrom,
                            parseInt(exactQuantity - 1, 10)
                          )}
                        </Typography>
                      );
                    }
                  }}
                </FormDataConsumer>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={submitting}
                >
                  <Add />
                  Add Record
                </Button>
                <Button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
            <FormDataConsumer>
              {({ formData, ...rest }) => {
                return (
                  <QuantityCheckTable
                    products={products}
                    filterItemId={formData.itemId}
                    onRowClick={handleRowClick}
                    onRemoveChecked={handleRemoveChecked}
                  />
                );
              }}
            </FormDataConsumer>
          </form>
        );
      }}
    />
  );
};
