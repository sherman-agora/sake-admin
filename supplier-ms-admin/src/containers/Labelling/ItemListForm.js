import React from 'react';
import { useTranslate, Loading } from 'react-admin';
import Box from '@material-ui/core/Box';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const GET_ITEM_LIST = gql`
  query inventoryItems($where: InventoryItemWhereInput!) {
    inventoryItems(where: $where) {
      id
      warehouse {
        id
        code
      }
      label
      expiryDay
      name
      brand
      sku
      image
      price
      unit
    }
  }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ItemListForm({ id, labelFrom, onChange }) {
  const classes = useStyles();
  const translate = useTranslate();
  const { loading, data } = useQuery(GET_ITEM_LIST, { variables: { where: { warehouse: { id }, label_contains: '' } } });

  if (loading) return <Loading loadingPrimary="menu.item.product" />;

  const { inventoryItems } = data;
  const itemGroups = Object.values(inventoryItems.reduce((results, item) => {
    const { name, brand, sku, expiryDay, price, unit } = item;
    if (!results[sku]) results[sku] = { name, brand, sku, expiryDay, price, unit, quantity: 0 };
    results[sku].quantity++;
    return results;
  }, {}));

  let cur = parseInt(labelFrom, 10);
  itemGroups.forEach(itemGroup => {
    itemGroup.labelFrom = cur;
    itemGroup.labelTo = cur + itemGroup.quantity;
    cur = cur + itemGroup.quantity + 1;
  });

  return (
    <Box component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{translate('purchaseOrder.productCode')}</TableCell>
            <TableCell align="right">{translate('purchaseOrder.productName')}</TableCell>
            <TableCell align="right">{translate('product.expiryDate')}</TableCell>
            <TableCell align="right">{translate('product.quantity')}</TableCell>
            <TableCell align="right">{translate('shipping.labelFrom')}</TableCell>
            <TableCell align="right">{translate('shipping.labelTo')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemGroups.map(row => (
            <TableRow key={row.code}>
              <TableCell align="right">{row.code}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.expiryDate}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right"><TextField label="Filled" variant="filled" defaultValue={row.labelFrom} /></TableCell>
              <TableCell align="right"><TextField label="Filled" variant="filled" defaultValue={row.labelTo} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}