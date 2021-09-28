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

const GET_PURCHASE_ORDER_DETAIL = gql`
  query getPurchaseOrder($where: PurchaseOrderWhereUniqueInput!) {
    purchaseOrder(where: $where) {
      id
      code
      products {
        id
        code
        price
        quantity
        expiryDate
      }
    }
  }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ProductListForm({ id, onChange }) {
  const classes = useStyles();
  const translate = useTranslate();
  const { loading, data } = useQuery(GET_PURCHASE_ORDER_DETAIL, { variables: { where: { id } } });

  if (loading) return <Loading loadingPrimary="menu.item.product" />;

  const { purchaseOrder } = data;

  // const handleChange = () => {
  //   onChange();
  // };

  return (
    <Box component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{translate('purchaseOrder.productCode')}</TableCell>
            <TableCell align="right">{translate('purchaseOrder.productName')}</TableCell>
            <TableCell align="right">{translate('product.cost')}</TableCell>
            <TableCell align="right">{translate('product.quantity')}</TableCell>
            <TableCell align="right">{translate('product.expiryDate')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseOrder.products.map(row => (
            <TableRow key={row.name}>
              <TableCell align="right">{row.code}</TableCell>
              <TableCell align="right">{row.nameEn}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{row.expiryDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}