import React, { useEffect, useState } from "react";
import { useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import dayjs from "dayjs";
// import ProductSelector from './ProductSelector';
import Button from "@material-ui/core/Button";
import BasicForm from "./BasicForm";
import Review from "./Review";
import Badge from "@material-ui/core/Badge";
import { ShoppingCart } from "@material-ui/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import sequentialNumber from "../../../utils/sequentialNumber";
import ProductImport from "./ProductImport";
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

const ADD_PURCHASE_ORDER = gql`
  mutation createPurchaseOrder($data: PurchaseOrderCreateInput!) {
    createPurchaseOrder(data: $data) {
      id
      code
    }
  }
`;

const GET_LAST_PURCHASE_ORDER = gql`
  query getLastPurchaseOrder {
    purchaseOrders(orderBy: code_DESC, first: 1) {
      id
      code
    }
  }
`;

const GET_FIRST_SUPPLIER = gql`
  query getFirstSupplier {
    suppliers(first: 1) {
      id
      name
      creditLine
    }
  }
`;

export default ({ permissions, ...props }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const classes = useStyles();
  const history = useHistory();
  const [addPO] = useMutation(ADD_PURCHASE_ORDER);
  const [activeStep, setActiveStep] = useState(0);
  const initialValues = {
    code: "",
    supplier: null,
    expectedDeliveryAt: dayjs().add(4, "month").toDate(),
    products: [],
    state: "PENDING",
  };
  const [formData, setFormData] = useState(initialValues);
  dispatch(
    setBreadcrumbs([
      { url: "/PurchaseOrder", label: "Purchase Order" },
      { url: "/PurchaseOrder/create", label: "Create New" },
    ])
  );
  let isNextBtnDisable;

  // getting new PO number
  const { loading: loadingPO, data: lastPO } = useQuery(
    GET_LAST_PURCHASE_ORDER
  );
  useEffect(() => {
    if (lastPO && lastPO.purchaseOrders.length > 0 && formData.code === "") {
      const last = lastPO.purchaseOrders[0];
      setFormData({
        ...formData,
        code: sequentialNumber.numberAfter(last.code),
      });
    }
  }, [lastPO, formData]);

  // getting default supplier
  const { loading: loadingSupplier, data: firstSupplier } = useQuery(
    GET_FIRST_SUPPLIER
  );
  useEffect(() => {
    if (
      firstSupplier &&
      firstSupplier.suppliers.length > 0 &&
      !formData.supplier
    ) {
      const supplier = firstSupplier.suppliers[0];
      setFormData({ ...formData, supplier });
    }
  }, [firstSupplier, formData]);

  if (loadingPO || loadingSupplier) return "<div>Loading...</div>";

  const steps = [
    translate("purchaseOrder.selectProducts"),
    translate("purchaseOrder.purchaseOrderDetails"),
    translate("purchaseOrder.review"),
  ];
  const calculateTotalPrice = () => {
    return formData.products.reduce((r, p) => {
      return r + parseFloat(p.quantity) * parseFloat(p.price);
    }, 0);
  };

  const handleSave = () => {
    const data = {
      code: formData.code,
      supplierId: formData.supplier.id,
      expectedDeliveryAt: dayjs(formData.expectedDeliveryAt).toISOString(),
      totalPrice: calculateTotalPrice(),
      state: formData.state,
      products: {
        create: formData.products.map((p) => ({
          productId: p.id,
          quantity: parseInt(p.quantity, 10),
          price: parseFloat(p.price),
          totalPrice: parseFloat(p.quantity) * parseFloat(p.price),
        })),
      },
    };
    addPO({ variables: { data } }).then(() => {
      history.push("/PurchaseOrder");
    });
  };

  // const handleProductSelected = (product, selected) => {
  //   const currentIds = formData.products.map(p => p.id);
  //   if (selected) {
  //     if (!currentIds.includes(product.id)) {
  //       setFormData({
  //         ...formData,
  //         products: [...formData.products, product],
  //       });
  //     }
  //   } else {
  //     if (currentIds.includes(product.id)) {
  //       formData.products.splice(currentIds.indexOf(product.id), 1);
  //       setFormData({
  //         ...formData,
  //         products: formData.products,
  //       });
  //     }
  //   }
  // };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  if (activeStep == 0 && formData.products.length == 0) {
    isNextBtnDisable = true;
  } else {
    isNextBtnDisable = false;
  }

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          {translate("purchaseOrder.createPurchaseOrder")}
          <Badge
            style={{ float: "right" }}
            badgeContent={formData.products.length}
            color="primary"
          >
            <ShoppingCart />
          </Badge>
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <React.Fragment>
          {activeStep === 0 && (
            <ProductImport formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 1 && (
            <BasicForm
              permissions={permissions}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeStep === 2 && (
            <Review formData={formData} setFormData={setFormData} />
          )}

          <div className={classes.buttons}>
            {activeStep > 0 && (
              <Button onClick={handleBack} color="primary">
                {translate("common.prev")}
              </Button>
            )}
            {activeStep < 2 && (
              <Button
                onClick={handleNext}
                color="primary"
                disabled={isNextBtnDisable}
              >
                {translate("common.next")}
              </Button>
            )}
            {activeStep === 2 && (
              <Button
                onClick={handleSave}
                color="primary"
              >
                {translate("common.save")}
              </Button>
            )}
          </div>
        </React.Fragment>
      </Paper>
    </main>
  );
};
