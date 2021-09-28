import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import Box from '@material-ui/core/Box';
import PurchaseOrderAutocomplete from '../../components/Inputs/PurchaseOrderAutocomplete';
import ProductListForm from './ProductListForm';
import Card from '@material-ui/core/Card';
import { Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import withStyles from '@material-ui/core/styles/withStyles';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import House from '@material-ui/icons/House';
import LocalShipping from '@material-ui/icons/LocalShipping';
import StepConnector from '@material-ui/core/StepConnector';

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

export default function Warehousing() {
  const translate = useTranslate();
  const classes = useStyles();
  const [purchaseOrderId, setPurchaseOrderId] = useState();

  const handleUpdate = () => console.log;
  const handleSave = () => console.log;
  return (
    <React.Fragment>
      <Box display="flex">
        <Box flex={1} mr="0.5em">
          <Typography variant="h5">{translate('shipping.warehousing')}</Typography>
          <Card className={classes.card}>
            <Stepper alternativeLabel connector={<StepperConnector />}>
              <Step key={translate('shipping.shipment')}>
                <StepLabel StepIconComponent={LocalShipping}>{translate('shipping.shipment')}</StepLabel>
              </Step>
              <Step key={translate('shipping.warehouse')}>
                <StepLabel StepIconComponent={House}>{translate('shipping.warehouse')}</StepLabel>
              </Step>
            </Stepper>
          </Card>
        </Box>
      </Box>
      <Box display="flex">
        <Box flex={1} mr="0.5em">
          <Card className={classes.card}>
            <PurchaseOrderAutocomplete onChange={setPurchaseOrderId} />
          </Card>
        </Box>
      </Box>
      {purchaseOrderId && (
        <React.Fragment>
          <Box display="flex">
            <Box flex={1} mr="0.5em">
              <Card className={classes.card}>
                <Typography variant="h6">{translate('shipping.productList')}</Typography>
                <ProductListForm id={purchaseOrderId} />
              </Card>
            </Box>
          </Box>
          <Card className={classes.card}>
            <Box display="flex">
              <Box flex={1} mr="0.5em">
                {translate('shipping.needToUpdatePO')}
                <Button color="primary" onClick={handleUpdate}>{translate('shipping.clickHere')}</Button>
              </Box>
              <Box flex={1} mr="0.5em" style={{ textAlign: 'right' }}>
                <Button color="primary" variant="contained" onClick={handleSave}>{translate('common.confirm')} {translate('shipping.warehousing')}</Button>
              </Box>
            </Box>
          </Card>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
