import { Box, Paper, TableContainer, TablePagination } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import QuantityCheckRow from "./QuantityCheckRow";
import React from "react";
import { useTranslate } from "react-admin";

export default ({ products, filterItemId, onRowClick, onRemoveChecked }) => {
  const translate = useTranslate();
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const records = filterItemId
    ? [products.find((p) => p.id === filterItemId)]
    : products;

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{translate("product.code")}</TableCell>
              <TableCell>{translate("product.name")}</TableCell>
              <TableCell align="right">
                {translate("product.quantity")}
              </TableCell>
              <TableCell align="right">
                {translate("shipping.quantityCheck")}
              </TableCell>
              <TableCell align="right">
                {translate("shipping.status")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <QuantityCheckRow
                row={row}
                key={row.id}
                onRowClick={onRowClick}
                onRemoveChecked={onRemoveChecked}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};
