import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './TablePaginationActions';

function ProductListPagination({ totalRows, page, rowsPerPage, setPage, setRowsPerPage }) {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          colSpan={4}
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
}

ProductListPagination.propTypes = {
  totalRows: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
};

export default ProductListPagination;