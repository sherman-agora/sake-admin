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

  return (
    <Box component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{translate('product.label')}</TableCell>
            <TableCell align="right">{translate('purchaseOrder.productCode')}</TableCell>
            <TableCell align="right">{translate('purchaseOrder.productName')}</TableCell>
            <TableCell align="right">{translate('product.expiryDate')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventoryItems.map(row => (
            <TableRow key={row.code}>
              <TableCell align="right">{row.label}</TableCell>
              <TableCell align="right">{row.code}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}