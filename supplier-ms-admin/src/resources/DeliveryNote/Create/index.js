import React, { useCallback, useEffect, useState } from "react";
import {
  useTranslate,
  FormWithRedirect,
  SaveButton,
  Toolbar,
  useCreate,
  useRedirect,
  useNotify,
} from "react-admin";
import { useFormState } from "react-final-form";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import InvoiceSelector from "./1_InvoiceSelector";
import QuantityCheckForm from "./2_QuantityCheckForm";
import BoxingForm from "./3_BoxingForm";
import Review from "./4_Review";
import Box from "@material-ui/core/Box";
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
}));
const GET_INVOICE = gql`
  query getInvoice($id: ID!) {
    invoice(where: { id: $id }) {
      code
    }
  }
`;

const SaveWithNoteButton = (props) => {
  const [create] = useCreate("DeliveryNote");
  const redirectTo = useRedirect();
  const notify = useNotify();
  const formState = useFormState();
  const { basePath, redirect } = props;
  const { loading, data: res } = useQuery(GET_INVOICE, {
    variables: { id: formState.values.invoiceId },
  });
  const handleClick = useCallback(() => {
    // call dataProvider.create() manually
    const { items, ...others } = formState.values;
    console.log(res.invoice.code);
    create(
      {
        payload: {
          data: {
            ...others,
            code: `DN-${res.invoice.code}`,
            items: items.map(({ productId, itemId, boxNum }) => ({
              productId,
              itemId,
              boxNum,
            })),
          },
        },
      },
      {
        onSuccess: ({ data: newRecord }) => {
          notify("ra.notification.created", "info", {
            smart_count: 1,
          });
          redirectTo(redirect, basePath, newRecord.id, newRecord);
        },
        onFailure: (error) => notify(`Error: ${error.message}`, "warning"),
      }
    );
  }, [create, notify, redirectTo, basePath, formState, redirect]);

  return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

// const ADD_DELIVERY_NOTE = gql`
//   mutation createDeliveryNote($data: DeliveryNoteCreateInput!) {
//     createDeliveryNote(data: $data) {
//       id
//     }
//   }
// `;

export default (props) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const classes = useStyles();
  const history = useHistory();
  // const [addDeliveryNote] = useMutation(ADD_DELIVERY_NOTE);
  const [activeStep, setActiveStep] = useState(0);
  dispatch(
    setBreadcrumbs([
      { url: "/DeliveryNote", label: "Delivery Note" },
      { url: "/DeliveryNote/create", label: "Create New" },
    ])
  );
  // const initialValues = {
  //   purchaseOrder: null,
  // };
  // const [formData, setFormData] = useState(initialValues);

  const steps = [
    translate("deliveryNote.selectInvoice"),
    translate("deliveryNote.quantityCheck"),
    translate("deliveryNote.packingBox"),
    translate("deliveryNote.review"),
  ];

  // const handleSave = () => {
  //   const data = {
  //     salesOrderId: formData.salesOrder.id,
  //     invoiceId: formData.invoice.id,
  //     deliveryDate: formData.invoice.shipmentDate,
  //     contactPerson: formData.invoice.contactPerson,
  //     items: {
  //       create: formData.items.map(item => ({
  //         id: item.id,
  //         productId: item.product.id,
  //         code: item.product.code,
  //         label: item.label,
  //         boxNum: item.boxNum,
  //       })),
  //     },
  //     state: 'PACKED',
  //   };
  //   console.log('create data', data);
  //   addDeliveryNote({ variables: { data } })
  //     .then(() => {
  //       history.push('/DeliveryNote');
  //     });
  // };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <FormWithRedirect
      {...props}
      render={(formProps) => {
        return (
          <form>
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
                    <InvoiceSelector formProps={formProps} />
                  )}
                  {activeStep === 1 && (
                    <QuantityCheckForm formProps={formProps} />
                  )}
                  {activeStep === 2 && <BoxingForm formProps={formProps} />}
                  {activeStep === 3 && <Review formProps={formProps} />}

                  <Toolbar>
                    <Box display="flex" justifyContent="flex-end" width="100%">
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
                      <SaveWithNoteButton
                        disabled={activeStep !== steps.length - 1}
                        basePath="/DeliveryNote"
                        redirect="/DeliveryNote"
                      />
                    </Box>
                  </Toolbar>
                </React.Fragment>
              </Paper>
            </main>
          </form>
        );
      }}
    />
  );
};
