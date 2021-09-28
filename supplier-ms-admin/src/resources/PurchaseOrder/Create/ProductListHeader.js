import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-admin';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';

function ProductListHeader({ onSort }) {
  const translate = useTranslate();
  const [orderBy, setOrderBy] = useState('id');
  const [desc, setDesc] = useState(false);

  const createOrderBy = (field) => () => {
    if (field === orderBy) {
      setDesc(!desc);
    } else {
      setOrderBy(field);
      setDesc(false);
    }
    onSort(`${orderBy}_${desc ? 'DESC' : 'ASC'}`);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>
          <TableSortLabel
            active={orderBy === 'code'}
            direction={desc ? 'desc' : 'asc'}
            onClick={createOrderBy('code')}
          >
            {translate('product.code')}
          </TableSortLabel>
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'nameEn'}
            direction={desc ? 'desc' : 'asc'}
            onClick={createOrderBy('nameEn')}
          >
            {translate('product.name')}
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'quantity'}
            direction={desc ? 'desc' : 'asc'}
            onClick={createOrderBy('quantity')}
          >
            {translate('inventory.stock')}
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

ProductListHeader.propTypes = {
  onSort: PropTypes.func.isRequired,
};

export default ProductListHeader;