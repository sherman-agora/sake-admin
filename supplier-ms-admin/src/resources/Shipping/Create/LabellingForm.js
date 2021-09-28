import React, { useState } from 'react';
import range from 'lodash/range';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-admin';
import { Box } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from '@material-ui/pickers';
import OptionDialog from '../../../components/OptionDialog/OptionDialog';
import WarehouseAutocomplete from '../../../components/Inputs/WarehouseAutocomplete';

function LabellingForm({ formData, setFormData }) {
  const translate = useTranslate();
  const defaultOpen = {
    type: '',
    selectedIndex: -1,
    value: '',
  };
  const [open, setOpen] = useState(defaultOpen);

  let { items, purchaseOrder } = formData;
  if (!items || items.length !== purchaseOrder.products.reduce((sum, p) => sum + p.exactQuantity, 0)) {
    items = purchaseOrder.products.reduce((results, product) => {
      results = [...results, ...(range(product.exactQuantity).map(() => ({
        product: product.product,
        poId: purchaseOrder.id,
        cost: product.price,
      })))];
      return results;
    }, []);
  }

  const handleLabelSave = (option) => {
    const { selectedIndex: i, value } = open;
    let labelNumber = parseInt(value, 10);
    if (option.id === 'this') {
      items[i].label = labelNumber;
    } else if (option.id === 'all') {
      for (let j = i; j < items.length; j += 1) {
        items[j].label = labelNumber;
        labelNumber += 1;
      }
    }
    setFormData({
      ...formData,
      items,
    });
    setOpen(defaultOpen);
  };

  const handleExpiryDateSave = (option) => {
    const { selectedIndex: i, value: expiryDate } = open;
    if (option.id === 'this') {
      items[i].expiryDate = expiryDate.toISOString();
    } else if (option.id === 'all') {
      for (let j = i; j < items.length; j += 1) {
        items[j].expiryDate = expiryDate.toISOString();
      }
    }
    setFormData({
      ...formData,
      items,
    });
    setOpen(defaultOpen);
  };

  const handleWarehouseSave = (option) => {
    const { selectedIndex: i, value } = open;
    if (option.id === 'this') {
      items[i].warehouse = value;
    } else if (option.id === 'all') {
      for (let j = i; j < items.length; j += 1) {
        items[j].warehouse = value;
      }
    }
    setFormData({
      ...formData,
      items,
    });
    setOpen(defaultOpen);
  };

  const handleOnLabelChange = (i) => (e) => {
    let labelNumber = parseInt(e.currentTarget.value, 10);
    items[i].label = labelNumber;
    setFormData({
      ...formData,
      items,
    });
  };

  const handleOnLabelKeyDown = (i) => (e) => {
    if (e.key === 'Enter') {
      setOpen({
        type: 'label',
        selectedIndex: i,
        value: e.currentTarget.value,
      });
    }
  };

  const handleOnLabelBlur = (i) => (e) => {
    setOpen({
      type: 'label',
      selectedIndex: i,
      value: e.currentTarget.value,
    });
  };

  const handleOnExpiryDateChange = (i) => (expiryDate) => {
    setOpen({
      type: 'expiryDate',
      selectedIndex: i,
      value: expiryDate,
    });
  };

  const handleOnWarehouseChange = (i) => (warehouse) => {
    setOpen({
      type: 'warehouse',
      selectedIndex: i,
      value: warehouse,
    });
  };

  return (
    <Box p={1}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{translate('product.code')}</TableCell>
            <TableCell>{translate('product.name')}</TableCell>
            <TableCell align="right">{translate('product.label')}</TableCell>
            <TableCell align="right">{translate('product.expiryDate')}</TableCell>
            <TableCell align="right">{translate('product.warehouse')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row, i) => {
            return (
              <TableRow key={row.product.code + i}>
                <TableCell>
                  {row.product.code}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.product.nameChi}<br />
                  {row.product.nameEn}
                </TableCell>
                <TableCell align="right">
                  <TextField
                    label={translate('product.label')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={row.label}
                    type="number"
                    onChange={handleOnLabelChange(i)}
                    onBlur={handleOnLabelBlur(i)}
                    onKeyDown={handleOnLabelKeyDown(i)}
                  />
                </TableCell>
                <TableCell align="right">
                  <DatePicker
                    format='DD MMM YYYY'
                    inputVariant="filled"
                    fullWidth
                    value={row.expiryDate}
                    label={translate('product.expiryDate')}
                    onChange={handleOnExpiryDateChange(i)}
                  />
                </TableCell>
                <TableCell align="right">
                  <WarehouseAutocomplete
                    defaultValue={row.warehouse}
                    onChange={handleOnWarehouseChange(i)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <OptionDialog
        onCancel={() => setOpen(false)}
        onSelect={handleLabelSave}
        title={translate('shipping.allTheFollowing')}
        options={[
          { id: 'all', label: translate('shipping.changeAll') },
          { id: 'this', label: translate('shipping.changeThisOnly') },
        ]}
        open={open.type === 'label'}
      />
      <OptionDialog
        onCancel={() => setOpen(false)}
        onSelect={handleExpiryDateSave}
        title={translate('shipping.allTheFollowing')}
        options={[
          { id: 'all', label: translate('shipping.changeAll') },
          { id: 'this', label: translate('shipping.changeThisOnly') },
        ]}
        open={open.type === 'expiryDate'}
      />
      <OptionDialog
        onCancel={() => setOpen(false)}
        onSelect={handleWarehouseSave}
        title={translate('shipping.allTheFollowing')}
        options={[
          { id: 'all', label: translate('shipping.changeAll') },
          { id: 'this', label: translate('shipping.changeThisOnly') },
        ]}
        open={open.type === 'warehouse'}
      />
    </Box>
  );
}

LabellingForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default LabellingForm;