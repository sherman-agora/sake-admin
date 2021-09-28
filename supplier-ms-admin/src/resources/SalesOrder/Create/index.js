import React, { useEffect, useState } from "react";
import { useTranslate, useNotify } from "react-admin";
import { useHistory } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import ProductSelector from "./ProductSelector";
import Button from "@material-ui/core/Button";
import BasicForm from "./BasicForm";
import Review from "./Review";
import Badge from "@material-ui/core/Badge";
import { ShoppingCart } from "@material-ui/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import sequentialNumber from "../../../utils/sequentialNumber";
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

const ADD_SALES_ORDER = gql`
  mutation createSalesOrder($data: SalesOrderCreateInput!) {
    createSalesOrder(data: $data) {
      id
      code
    }
  }
`;

const GET_LAST_SALES_ORDER = gql`
  query getLastSalesOrder {
    salesOrders(orderBy: createdAt_DESC, first: 1) {
      id
      code
    }
  }
`;

const GET_FIRST_CUSTOMER = gql`
  query getFirstCustomer {
    customers(first: 1) {
      code
      id
      nameEn
      nameChi
      wholesalePlan
    }
  }
`;

export default () => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const classes = useStyles();
  const history = useHistory();
  const notify = useNotify();
  const [addPO] = useMutation(ADD_SALES_ORDER);
  const [activeStep, setActiveStep] = useState(0);
  const initialValues = {
    code: "",
    customer: null,
    products: [],
    state: "RECEIVED",
    customerShop: null,
  };
  const [formData, setFormData] = useState(initialValues);
  dispatch(
    setBreadcrumbs([
      { url: "/SalesOrder", label: "Sales Order" },
      { url: "/SalesOrder/create", label: "Create New" },
    ])
  );

  // getting new PO number
  const { loading: loadingPO, data: lastPO } = useQuery(GET_LAST_SALES_ORDER);
  useEffect(() => {
    if (lastPO && lastPO.salesOrders.length > 0 && formData.code === "") {
      const last = lastPO.salesOrders[0];
      setFormData({
        ...formData,
        code: sequentialNumber.numberAfter(last.code),
      });
    }
  }, [lastPO, formData]);

  // getting default customer
  const { loading: loadingCustomer, data: firstCustomer } = useQuery(
    GET_FIRST_CUSTOMER
  );
  useEffect(() => {
    if (
      firstCustomer &&
      firstCustomer.customers.length > 0 &&
      !formData.customer
    ) {
      const customer = firstCustomer.customers[0];
      setFormData({ ...formData, customer });
    }
  }, [firstCustomer, formData]);

  if (loadingPO || loadingCustomer) return "<div>Loading...</div>";

  const steps = [
    translate("salesOrder.salesOrderDetails"),
    translate("salesOrder.selectProducts"),
    translate("salesOrder.review"),
  ];

  const calculateTotalPrice = () => {
    return formData.products.reduce((r, p) => {
      return r + parseFloat(p.price) * p.quantity;
    }, 0);
  };
  const calculateSubTotalPrice = () => {
    return formData.products.reduce((r, p) => {
      if (p.discount) {
        if (p.discount.includes("%")) {
          const percent = 1 - parseFloat(p.discount) / 100;
          return r + (parseFloat(p.price) / percent) * p.quantity;
        } else if (p.discount.includes("HKD")) {
          const discountAmount = parseFloat(p.discount.replace("HKD", ""));
          return r + (parseFloat(p.price) + discountAmount) * p.quantity;
        }
      } else {
        return r + parseFloat(p.price) * p.quantity;
      }
    }, 0);
  };

  const calculateSubPriceForItem = (p) => {
    if (p.discount) {
      if (p.discount.includes("%")) {
        const percent = 1 - parseFloat(p.discount) / 100;
        return parseFloat(p.price) / percent;
      } else if (p.discount.includes("HKD")) {
        const discountAmount = parseFloat(p.discount.replace("HKD", ""));
        return parseFloat(p.price) + discountAmount;
      }
    } else {
      return 0;
    }
  };

  const handleSave = () => {
    const grandTotal = calculateTotalPrice();
    const subtotal = calculateSubTotalPrice();
    const data = {
      code: formData.code,
      grandTotal,
      subtotal,
      remark: formData.remark,
      discountAmount: subtotal - grandTotal,
      state: formData.state,
      shopId: formData.customerShop.id,
      products: {
        create: formData.products.map((p) => ({
          discount: p.discount || `0%`,
          productId: p.id,
          quantity: parseInt(p.quantity, 10),
          price: parseFloat(p.price),
          discountAmount:
            calculateSubPriceForItem(p) == 0
              ? 0
              : calculateSubPriceForItem(p) * parseFloat(p.quantity) -
                parseFloat(p.quantity) * parseFloat(p.price),
          wholeSalePrice: calculateSubPriceForItem(p),
          totalPrice: parseFloat(p.quantity) * parseFloat(p.price),
        })),
      },
    };

    addPO({ variables: { data } })
      .then(() => {
        history.push("/SalesOrder");
      })
      .catch((error) => {
        notify(`Error: ${error.message}`, "warning");
      });
  };

  const handleProductSelected = (product, selected) => {
    const currentIds = formData.products.map((p) => p.id);
    if (selected) {
      if (!currentIds.includes(product.id)) {
        setFormData({
          ...formData,
          products: [...formData.products, product],
        });
      }
    } else {
      if (currentIds.includes(product.id)) {
        formData.products.splice(currentIds.indexOf(product.id), 1);
        setFormData({
          ...formData,
          products: formData.products,
        });
      }
    }
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          {translate("salesOrder.createSalesOrder")}
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
            <BasicForm formData={formData} setFormData={setFormData} />
          )}
          {activeStep === 1 && (
            <ProductSelector
              selected={formData.products}
              onSelected={handleProductSelected}
              customer={formData.customer}
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
