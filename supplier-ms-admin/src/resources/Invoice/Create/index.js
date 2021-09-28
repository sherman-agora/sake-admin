import React, { useEffect, useState } from "react";
import { useTranslate, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import SalesOrderSelector from "./SalesOrderSelector";
import Review from "./Review";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import BasicForm from "./BasicForm";
import sequentialNumber from "../../../utils/sequentialNumber";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../../redux/breadcrumbs";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(1024 + theme.spacing(2) * 2)]: {
      width: 1024,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(1024 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
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

const GET_LAST_INVOICE = gql`
  query getLastInvoice {
    invoices(orderBy: createdAt_DESC, first: 1) {
      id
      code
    }
  }
`;

const ADD_INVOICE = gql`
  mutation createInvoice($data: InvoiceCreateInput!) {
    createInvoice(data: $data) {
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
  const [addInvoice] = useMutation(ADD_INVOICE);
  const [activeStep, setActiveStep] = useState(0);
  const initialValues = {
    code: "IV001",
    salesOrderCode: "",
    salesOrderId: "",
    salesOrder: null,
    contactPerson: "",
    totalPrice: 0,
    state: "CONFIRMED",
  };
  const [formData, setFormData] = useState(initialValues);

  dispatch(
    setBreadcrumbs([
      { url: "/Invoice", label: "Invoice" },
      { url: "/Invoice/create", label: "Create New" },
    ])
  );

  // getting new invoice number
  const { data: lastInvoice } = useQuery(GET_LAST_INVOICE);
  useEffect(() => {
    if (
      lastInvoice &&
      lastInvoice.invoices.length > 0 &&
      formData.code === "IV001"
    ) {
      const last = lastInvoice.invoices[0];
      setFormData({
        ...formData,
        code: sequentialNumber.numberAfter(last.code),
      });
    }
  }, [lastInvoice, formData]);

  const steps = [
    translate("invoice.selectSalesOrder"),
    translate("invoice.invoiceDetails"),
    translate("invoice.review"),
  ];
  const notify = useNotify();
  const handleSave = () => {
    const data = {
      code: formData.code,
      salesOrderId: formData.salesOrderId,
      totalPrice: formData.totalPrice,
      shipmentDate: formData.shipmentDate,
      state: formData.state,
      paymentStatus: "UNPAID",
    };
    addInvoice({ variables: { data } })
      .then(() => {
        history.push("/Invoice");
      })
      .catch((error) => {
        notify(`Error: ${error.message}`, "warning");
      });
  };

  const handleNext = () => {
    if (formData.salesOrderId === "" || formData.code === "") {
      notify(`Error : Please fill all field.`, "warning");
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
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

        <React.Fragment>
          {activeStep === 0 && (
            <SalesOrderSelector formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 1 && (
            <BasicForm formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 2 && <Review formData={formData} />}

          <div className={classes.buttons}>
            {activeStep > 0 && (
              <Button onClick={handleBack} color="primary">
                {translate("common.prev")}
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button onClick={handleNext} color="primary">
                {translate("common.next")}
              </Button>
            )}
            {activeStep === steps.length - 1 && (
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
