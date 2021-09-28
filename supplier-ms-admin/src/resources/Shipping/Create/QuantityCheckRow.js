import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import { KeyboardArrowDown, KeyboardArrowUp, Remove } from '@material-ui/icons';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOffOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { NumberField, ReferenceField, TextField, DateField } from 'react-admin';
import BilingualField from '../../../components/BilingualField';
import Button from '@material-ui/core/Button';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

export default ({ row, onRowClick, onRemoveChecked }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const { product, checked, quantity, id } = row;
  const totalExactQuantity = checked ? checked.reduce((sum, r) => {
    sum += parseInt(r.exactQuantity, 10);
    return sum;
  }, 0) : 0;
  const handleRowClick = () => {
    onRowClick && onRowClick(row);
  }
  const handleRemoveChecked = (index) => () => {
    onRemoveChecked && onRemoveChecked(index, row);
  }
  return (
    <React.Fragment>
      <TableRow hover className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell><TextField source="code" record={product} /></TableCell>
        <TableCell component="th">
          <BilingualField source="name" record={product} />
        </TableCell>
        <TableCell align="right">{quantity}</TableCell>
        <TableCell align="right">{totalExactQuantity}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleRowClick}>
            {quantity === totalExactQuantity ? <CheckCircleIcon color="secondary" /> : <HighlightOffIcon color="primary" />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Labels</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {checked && checked.map((detail, i) => {
                    return (
                      <TableRow key={`checked-${id}-${i}`}>
                        <TableCell>
                          <ReferenceField source="warehouseId" record={detail} reference="Warehouse" basePath="/Warehouse">
                            <TextField source="name" />
                          </ReferenceField>
                        </TableCell>
                        <TableCell>
                          <DateField source="expiryDate" record={detail} />
                        </TableCell>
                        <TableCell>
                          <NumberField source="exactQuantity" record={detail} />
                        </TableCell>
                        <TableCell align="right">{detail.labelFrom} - {detail.labelTo}</TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small" onClick={handleRemoveChecked(i)} color="secondary">
                            <Remove />
                            <Typography variant="body1">Remove</Typography>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}