import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { useTranslate } from 'react-admin';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CustomerAutocomplete from '../../../components/Inputs/CustomerAutocomplete';
import { DatePicker } from '@material-ui/pickers';

function BasicForm({ formData, setFormData }) {
  const translate = useTranslate();
  return (
    <form noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DatePicker inputVariant="filled" fullWidth value={formData.shipmentDate} label={translate('purchaseOrder.expectedDeliveryAt')} onChange={newDate => setFormData({ ...formData, shipmentDate: newDate.toISOString() })} />
        </Grid>
      </Grid>
    </form>
  );
}

export default BasicForm;
