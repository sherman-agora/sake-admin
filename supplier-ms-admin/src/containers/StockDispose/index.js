import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import Box from '@material-ui/core/Box';
import ItemListForm from './ItemListForm';
import Card from '@material-ui/core/Card';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import withStyles from '@material-ui/core/styles/withStyles';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import House from '@material-ui/icons/House';
import DeleteForever from '@material-ui/icons/DeleteForever';
import StepConnector from '@material-ui/core/StepConnector';
import WarehouseAutocomplete from '../../components/Inputs/WarehouseAutocomplete';

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

const StepperConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

export default function StockDispose() {
  const translate = useTranslate();
  const classes = useStyles();
  const [warehouseId, setWarehouseId] = useState();

  const handleSave = () => console.log;
  return (
    <React.Fragment>
      <Box display="flex">
        <Box flex={1} mr="0.5em">
          <Typography variant="h5">{translate('inventory.stockDispose')}</Typography>
          <Card className={classes.card}>
            <Stepper alternativeLabel connector={<StepperConnector />}>
              <Step key={translate('inventory.warehouse')}>
                <StepLabel StepIconComponent={House}>{translate('inventory.warehouse')} {translate('common.from')}</StepLabel>
              </Step>
              <Step key={translate('inventory.trash')}>
                <StepLabel StepIconComponent={DeleteForever}>{translate('inventory.trash')}</StepLabel>
              </Step>
            </Stepper>
          </Card>
        </Box>
      </Box>
      <Card className={classes.card}>
        <Box display="flex">
          <Box flex={1} mr="0.5em">
            <WarehouseAutocomplete onChange={setWarehouseId} label={translate('inventory.warehouse') + ' ' + translate('common.from')} />
          </Box>
        </Box>
      </Card>
      {warehouseId && (
        <React.Fragment>
          <Box display="flex">
            <Box flex={1} mr="0.5em">
              <Card className={classes.card}>
                <Typography variant="h6">{translate('inventory.productItem')}</Typography>
                <ItemListForm id={warehouseId} />
              </Card>
            </Box>
          </Box>
          <Card className={classes.card}>
            <Box display="flex">
              <Box flex={1} mr="0.5em" style={{ textAlign: 'right' }}>
                <Button color="primary" variant="contained" onClick={handleSave}>{translate('common.transfer')}</Button>
              </Box>
            </Box>
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
