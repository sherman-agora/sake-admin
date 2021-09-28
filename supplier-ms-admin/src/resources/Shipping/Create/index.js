import React, { useEffect, useState } from "react";
import { useTranslate, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PurchaseOrderSelector from "./PurchaseOrderSelector";
import Review from "./Review";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import QuantityCheck from "./QuantityCheck";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../../redux/breadcrumbs";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const ADD_SHIPPING = gql`
  mutation createShipping($data: ShippingCreateInput!) {
    createShipping(data: $data) {
      id
      code
    }
  }
`;

export default () => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const classes = useStyles();
  const history = useHistory();
  const notify = useNotify();
  const [addShipping] = useMutation(ADD_SHIPPING);
  const [activeStep, setActiveStep] = useState(0);
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [open, setOpen] = React.useState(false);
  const initialValues = {
    purchaseOrder: null,
    checkedProducts: {},
    totalPrice: 0,
  };
  const [formData, setFormData] = useState(initialValues);
  dispatch(
    setBreadcrumbs([
      { url: "/Shipping", label: "Shipping" },
      { url: `/Shipping/create`, label: "Create New" },
    ])
  );

  const steps = [
    translate("shipping.selectPurchaseOrder"),
    translate("shipping.quantityCheck"),
    translate("shipping.review"),
  ];

  const handleSave = () => {
    const { purchaseOrder, totalPrice } = formData;

    addShipping({
      variables: {
        data: {
          code: `SP-${purchaseOrder.code}`,
          purchaseOrderId: purchaseOrder.id,
          deliveryAt: dayjs().toISOString(),
          totalPrice,
          products: {
            create: purchaseOrder.products.reduce((arr, p) => {
              const { checked } = p;
              if (!checked || checked.length === 0) {
                return arr;
              }
              const expectedQuantity = parseInt(p.quantity, 10) || 0;
              const fields = checked.map((c) => ({
                productId: p.product.id,
                warehouseId: c.warehouseId,
                labelFrom: c.labelFrom,
                labelTo: c.labelTo,
                expiryDate: c.expiryDate === "-" ? null : c.expiryDate,
                expectedQuantity,
                quantity: parseInt(c.exactQuantity, 10) || 0,
                price: p.price,
                totalPrice: expectedQuantity * p.price,
              }));

              return [...arr, ...fields];
            }, []),
          },
        },
      },
    })
      .then(() => {
        history.push("/Shipping");
      })
      .catch((error) => {
        notify(`Error: ${error.message}`, "warning");
      });
  };

  const checkQuantity = () => {
    const { products } = formData.purchaseOrder;
    for (let item of products) {
      const expectedQuantity = parseInt(item.quantity, 10) || 0;
      const quantity = item.checked
        ? item.checked.reduce((sum, c) => {
            sum += parseInt(c.exactQuantity, 10);
            return sum;
          }, 0)
        : 0;
      if (expectedQuantity !== quantity) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 1 && !checkQuantity()) {
      handleClickOpen();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (option) => () => {
    if (option) {
      setOpen(false);
      setActiveStep(activeStep + 1);
    } else {
      setOpen(false);
    }
  };
  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Warning!!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Some product's quantity not match! Continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose(false)} color="primary">
              No
            </Button>
            <Button onClick={handleClose(true)} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <React.Fragment>
          {activeStep === 0 && (
            <PurchaseOrderSelector
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeStep === 1 && (
            <QuantityCheck
              setCheckSuccess={setCheckSuccess}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeStep === 2 && <Review formData={formData} />}

          <div className={classes.buttons}>
            {activeStep > 0 && (
              <Button onClick={handleBack} color="primary">
                {translate("common.prev")}
              </Button>
            )}
            {activeStep < 2 && (
              <Button onClick={handleNext} color="primary">
                {translate("common.next")}
              </Button>
            )}
            {activeStep === 2 && (
              <Button onClick={handleSave} color="primary">
                {translate("common.confirm")}
              </Button>
            )}
          </div>
        </React.Fragment>
      </Paper>
    </main>
  );
};
