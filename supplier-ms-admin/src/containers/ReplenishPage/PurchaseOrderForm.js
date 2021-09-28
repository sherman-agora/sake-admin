import React, { useState } from 'react';
// import dayjs from 'dayjs';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardDatePicker } from '@material-ui/pickers';

export default function PurchaseOrderForm() {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Purchase Order Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField required id="supplier" label="Supplier" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/DD/YYYY"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField id="remarks" label="Remarks" multiline fullWidth rowsMax="4" />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
