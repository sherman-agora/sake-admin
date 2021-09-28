import React, { useState } from "react";
import { useTranslate, useNotify } from "react-admin";
import Button from "@material-ui/core/Button";
import WarehouseAutocomplete from "../../components/Inputs/WarehouseAutocomplete";
import { Paper, Grid, TextField } from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

const QUERY_ITEM = gql`
  query getItem($where: InventoryItemWhereUniqueInput!) {
    inventoryItem(where: $where) {
      label
      id
      warehouse {
        id
      }
    }
  }
`;

const DELETE_DELIVERY_ITEM = gql`
  mutation deleteItem($where: DeliveryItemWhereUniqueInput!) {
    deleteDeliveryItem(where: $where) {
      id
    }
  }
`;

const TRANSFER = gql`
  mutation transfer($data: TransferWarehouse!) {
    transferWarehouse(data: $data) {
      id
    }
  }
`;

export default function DeliveryItemDelete(props) {
  const translate = useTranslate();
  // const classes = useStyles();
  const notify = useNotify();
  const [warehouseId, setWarehouseId] = useState();
  const [deleteDeliveryItem] = useMutation(DELETE_DELIVERY_ITEM);
  const [transfer] = useMutation(TRANSFER);
  const { record } = props.location.state;
  const { loading, data } = useQuery(QUERY_ITEM, {
    variables: { where: { id: record.item.id } },
  });
  const history = useHistory();

  const redirect = () => {
    return history.go(-1);
  };
  const itemData = data && data.inventoryItem;
  console.log(record);
  console.log(itemData);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleSave = async () => {
    try {
      await deleteDeliveryItem({
        variables: {
          where: { id: record.id },
        },
      }).then((value) => {
        console.log("res", value);
        notify(`Save Success.`);
        redirect();
      });
    } catch (error) {
      notify(`Error: ${error.message}`, "warning");
    }
  };

  return (
    <Paper>
      <Grid
        container
        direction="column"
        justify="space-between"
        style={{ height: 300, padding: 10 }}
      >
        <h1>Delete Deliery Item</h1>
        <Grid item>
          <TextField
            id="id"
            label="Delivery Item"
            variant="filled"
            defaultValue={itemData.label}
            disabled={true}
          />
        </Grid>
        <Grid xs={4} item>
          <WarehouseAutocomplete
            onChange={setWarehouseId}
            label={
              translate("inventory.warehouse") + " " + translate("common.from")
            }
            where={{ where: { name_not_in: " " } }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
