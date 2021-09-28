import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { Box, TableContainer, Paper, TablePagination } from '@material-ui/core';
import { useTranslate } from 'react-admin';
import TextField from '@material-ui/core/TextField';
import WarehouseAutocomplete from '../../../components/Inputs/WarehouseAutocomplete';
import sequentialNumber from '../../../utils/sequentialNumber';

function QuantityCheckForm({ formData, setFormData }) {
  const translate = useTranslate();

  const { products } = formData.purchaseOrder;

  const handleOnWarehouseChange = (i) => (warehouse) => {
    products[i].warehouse = warehouse;
    setFormData({
      ...formData,
      purchaseOrder: {
        ...formData.purchaseOrder,
        products,
      },
    });
  };

  const handleOnExpiryDateChange = (i) => (e) => {
    products[i].expiryDate = e.target.value;
    setFormData({
      ...formData,
      purchaseOrder: {
        ...formData.purchaseOrder,
        products,
      },
    });
  };

  const handleOnLabelFromChange = (i) => (e) => {
    const labelFrom = e.target.value.toUpperCase();
    if (labelFrom && labelFrom.length > 0) {
      products[i].labelTo = sequentialNumber.numberAfter(labelFrom, products[i].exactQuantity)
    }
    products[i].labelFrom = labelFrom;
    setFormData({
      ...formData,
      purchaseOrder: {
        ...formData.purchaseOrder,
        products,
      },
    });
  };

  const handleOnLabelToChange = (i) => (e) => {
    products[i].labelTo = e.target.value.toUpperCase();
    setFormData({
      ...formData,
      purchaseOrder: {
        ...formData.purchaseOrder,
        products,
      },
    });
  };
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  products.map(row => row.expiryDate = row.expiryDate || '-');
  return (
    <Box p={1}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{translate('product.code')}</TableCell>
              <TableCell>{translate('product.name')}</TableCell>
              <TableCell align="right">{translate('product.quantity')}</TableCell>
              <TableCell align="right">{translate('product.warehouse')}</TableCell>
              <TableCell align="right">{translate('product.expiryDate')}</TableCell>
              <TableCell align="right">{translate('shipping.labelFrom')}</TableCell>
              <TableCell align="right">{translate('shipping.labelTo')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.product.code}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.product.nameChi}<br />
                    {row.product.nameEn}
                  </TableCell>
                  <TableCell align="right">
                    {row.exactQuantity}
                  </TableCell>
                  <TableCell align="right">
                    <WarehouseAutocomplete
                      defaultValue={row.warehouse}
                      onChange={handleOnWarehouseChange(i)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      label="product.expiryDate"
                      type="date"
                      value={row.expiryDate}
                      variant="filled"
                      onChange={handleOnExpiryDateChange(i)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      label={`${translate('product.label')} ${translate('common.from')}`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={row.labelFrom}
                      onChange={handleOnLabelFromChange(i)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      label={`${translate('product.label')} ${translate('common.to')}`}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={row.labelTo}
                      onChange={handleOnLabelToChange(i)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Box>
  );
}

QuantityCheckForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default QuantityCheckForm;