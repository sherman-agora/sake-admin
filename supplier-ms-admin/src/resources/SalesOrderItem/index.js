import { useMutation } from "@apollo/react-hooks";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import gql from "graphql-tag";
import React, { useCallback, useEffect, useState } from "react";
import {
  AutocompleteInput,
  Create,
  Edit,
  FormDataConsumer,
  FunctionField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
  useCreate,
  useNotify,
  useTranslate,
} from "react-admin";
import { useFormState } from "react-final-form";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { addBreadcrumbs } from "../../redux/breadcrumbs";

const SaveItemButton = (props) => {
  console.log("1301025: ", props.selectedProduct);
  const [create] = useCreate("SalesOrderItem");
  const history = useHistory();

  const redirect = () => {
    return history.go(-1);
  };

  const notify = useNotify();

  const formState = useFormState();
  console.log("formState", formState);
  const selectedQuantity = parseInt(formState.values.quantity, 10);
  const selectedProduct = formState.values.product;

  const calculateDiscount = (formData, product) => {
    if (product.discount) {
      if (product.discount.includes("%")) {
        const percent = 1 - parseFloat(product.discount) / 100;
        return parseFloat(formData.price) / percent;
      } else if (product.discount.includes("HKD")) {
        const discountAmount = parseFloat(product.discount.replace("HKD", ""));
        return parseFloat(formData.price) + discountAmount;
      }
    } else {
      return parseFloat(formData.price);
    }
  };

  const handleClick = useCallback(() => {
    if (!formState.valid) {
      return;
    }
    const { product, ...formValues } = formState.values;
    const quantity = parseInt(formValues.quantity, 10);
    const price = parseFloat(formValues.price);
    const wholeSalePrice = calculateDiscount(formValues, product);
    console.log("wholeSalePrice: ", wholeSalePrice);

    delete formValues.customer;
    console.log("product: ", product);
    create(
      {
        payload: {
          data: {
            ...formValues,
            productId: product.id,
            discount: product.discount || "0%",
            discountAmount: wholeSalePrice * quantity - price * quantity,
            wholeSalePrice,
            totalPrice: quantity * price,
          },
        },
      },
      {
        onSuccess: ({ data: newRecord }) => {
          notify("ra.notification.created", "info", {
            smart_count: 1,
          });
          redirect();
        },
      }
    );
  }, [formState.valid, formState.values, create, notify, redirect]);

  if (!selectedProduct) {
    return <a>Please Select Product</a>;
  } else if (selectedProduct.quantity < selectedQuantity) {
    return <a>Out of Stock</a>;
  } else {
    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
  }
};

const SalesOrderItemCreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveItemButton
      label="common.save"
      submitOnEnter={false}
      variant="text"
      product={props.selectedProduct}
    />
  </Toolbar>
);

const OptionRenderer = (choice) => (
  <span>
    {choice.record.code} {choice.record.nameChi}
  </span>
);

export function SalesOrderItemCreate(props) {
  const location = useLocation();
  const customerPlan = location.state.record.customer.wholesalePlan;
  const translate = useTranslate();
  const [selectedProduct, setSelectProduct] = useState();
  const [selectBtn, setSelectBtn] = useState(customerPlan);
  let wholeSalePriceList = !selectedProduct
    ? []
    : [
      selectedProduct.wholeSalePrice1,
      selectedProduct.wholeSalePrice2,
      selectedProduct.wholeSalePrice3,
      selectedProduct.wholeSalePrice4,
      selectedProduct.wholeSalePrice5,
    ];
  if (
    selectedProduct &&
    selectedProduct.discount &&
    wholeSalePriceList.length > 0
  ) {
    if (selectedProduct.discount.includes("%")) {
      const percent = 1 - parseFloat(selectedProduct.discount) / 100;
      console.log(percent);
      wholeSalePriceList = wholeSalePriceList.map((price) => price * percent);
      console.log("wholeSalePriceList:", wholeSalePriceList);
    } else if (selectedProduct.discount.includes("HKD")) {
      const discountAmount = parseFloat(
        selectedProduct.discount.replace("HKD", "")
      );
      wholeSalePriceList = wholeSalePriceList.map(
        (price) => price - discountAmount
      );
    }
  }
  let price;

  const dispatch = useDispatch();
  dispatch(
    addBreadcrumbs({
      url: "/SalesOrderItem/create",
      label: "Add New Sales Order Item",
    })
  );
  const searchProduct = (searchText) => ({
    code_contains: searchText,
  });

  const renderBtnGroup = (formData) => {
    return (
      <ButtonGroup>
        {wholeSalePriceList.map((price, index) => (
          <Button
            onClick={() => {
              setSelectBtn(index + 1);
              formData.price = price;
              console.log(price);
            }}
            color={selectBtn == index + 1 ? "secondary" : undefined}
            variant="contained"
          >
            {translate("product.wholeSalePrice")}
            {index + 1}
          </Button>
        ))}
      </ButtonGroup>
    );
  };

  const inputText = (record) => () => {
    setSelectProduct(record);
    console.log("product", selectedProduct);
    return record.code;
  };

  return (
    <Create {...props}>
      <SimpleForm
        toolbar={<SalesOrderItemCreateToolbar product={selectedProduct} />}
        variant="standard"
      >
        <ReferenceInput
          label="Sales Order"
          source="salesOrder.id"
          reference="SalesOrder"
        >
          <SelectInput disabled optionText="code" label="Sales Order No." />
        </ReferenceInput>
        <ReferenceInput
          filterToQuery={searchProduct}
          label="Product"
          source="product.id"
          reference="Product"
        >
          <AutocompleteInput
            optionText={<OptionRenderer />}
            label="Sales Order No."
            inputText={inputText}
            matchSuggestion={(filterValue, suggestion) => true}
          />
        </ReferenceInput>

        <NumberInput source="quantity" />
        {/* <NumberInput source="price" /> */}
        <FormDataConsumer>
          {({ formData }) => {
            formData.price = wholeSalePriceList[selectBtn - 1];
            console.log("formproduct: ", formData.product);
            if (selectedProduct) {
              formData.product.discount = selectedProduct.discount;
              formData.product.quantity = selectedProduct.quantity;
            }

            return (
              <Grid direction="column" container spacing={3}>
                <Grid item xs={6}>
                  {selectedProduct && (
                    <TextField
                      label="price"
                      type="number"
                      defaultValue={wholeSalePriceList[selectBtn - 1]}
                      onChange={(e) => {
                        const { value } = e.target;
                        formData.price = value;
                      }}
                      value={formData.price}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  {selectedProduct && renderBtnGroup(formData)}
                </Grid>
              </Grid>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
}

// ########################## Edit Item ##########################################

const UPDATE_SALES_ORDER_ITEM = gql`
  mutation updateSalesOrderItem(
    $data: SalesOrderItemUpdateInput!
    $where: SalesOrderItemWhereUniqueInput!
  ) {
    updateSalesOrderItem(data: $data, where: $where) {
      id
    }
  }
`;

const SaveEditButton = (props) => {
  const history = useHistory();
  const [update] = useMutation(UPDATE_SALES_ORDER_ITEM);

  const redirect = () => {
    return history.go(-1);
  };

  const notify = useNotify();

  const formState = useFormState();
  const {
    wholeSalePrice,
    price,
    quantity,
    id,
    discountPercent,
    discountCash,
    discountType,
  } = formState.values;

  const handleClick = () => {
    console.log("formState: ", formState.values);
    update({
      variables: {
        data: {
          price,
          quantity,
          wholeSalePrice,
          discount:
            discountType == "present"
              ? `${discountPercent}%`
              : `HKD${discountCash}`,
        },
        where: { id },
      },
    }).then((value) => {
      notify("Edit Success");
      redirect();
    });
  };

  return (
    <SaveButton
      {...props}
      handleSubmitWithRedirect={handleClick}
      disabled={wholeSalePrice < 0}
    />
  );
};

const SalesOrderItemEditToolBar = (props) => (
  <Toolbar {...props}>
    <SaveEditButton label="common.save" submitOnEnter={false} variant="text" />
  </Toolbar>
);

export const SalesOrderItemEdit = (props) => {
  const [wholesalePlan, setWholesalePlan] = useState(1);
  const [product, setProduct] = useState();
  const [selectBtn, setSelectBtn] = useState();

  console.log("loggin the props: ", props);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wholesalePlan) {
      console.log("change btn!!");
      setSelectBtn(wholesalePlan - 1);
    }
    // if (!product) {
    //   setProduct(product);
    // }
  }, wholesalePlan);
  console.log("productproductproductproductproduct: ", product);

  const saveWholesalesPlan = (record) => {
    setWholesalePlan(record.wholesalePlan - 1);
    return `${record.wholesalePlan}`;
  };
  const selectedProduct = (record) => {
    console.log("Product: ", record);
    setProduct(record);
    return `${record.code}`;
  };

  const renderBtnGroup = (formData) => {
    const wholeSalePriceList = [
      product.wholeSalePrice1,
      product.wholeSalePrice2,
      product.wholeSalePrice3,
      product.wholeSalePrice4,
      product.wholeSalePrice5,
    ];
    console.log("render Btn Group: selectBtn", selectBtn);
    formData.wholeSalePrice = wholeSalePriceList[selectBtn];

    return (
      <ButtonGroup>
        {wholeSalePriceList.map((price, index) => (
          <Button
            key={index}
            onClick={() => {
              setSelectBtn(index);
              formData.wholeSalePrice = price;
              console.log(price);
            }}
            color={selectBtn == index ? "secondary" : undefined}
            variant="contained"
          >
            <Grid container>
              <Grid item>
                <h3>{`wholeSalePrice ${index + 1}`}</h3>
              </Grid>
              <Grid item>
                <h3>{`Price: ${price}`}</h3>
              </Grid>
            </Grid>
          </Button>
        ))}
      </ButtonGroup>
    );
  };

  return (
    <Edit {...props}>
      <SimpleForm variant="standard" toolbar={<SalesOrderItemEditToolBar />}>
        <ReferenceField
          label="Customer Whole Sale Plan"
          source="salesOrder.id"
          reference="SalesOrder"
        >
          <ReferenceField source="shop.id" reference="CustomerShop">
            <ReferenceField source="customer.id" reference="Customer">
              <FunctionField
                label="wholesalePlan"
                render={(record) => saveWholesalesPlan(record)}
              />
            </ReferenceField>
          </ReferenceField>
        </ReferenceField>
        <ReferenceInput
          label="Sales Order"
          source="salesOrder.id"
          reference="SalesOrder"
        >
          <SelectInput disabled optionText="code" label="Sales Order No." />
        </ReferenceInput>
        <ReferenceField label="Product" source="product.id" reference="Product">
          <FunctionField
            label="Code"
            render={(record) => selectedProduct(record)}
          />
        </ReferenceField>
        <NumberInput source="quantity" />
        <FormDataConsumer>
          {({ formData }) => {
            dispatch(
              addBreadcrumbs({
                url: `/SalesOrderItem/${formData.id}`,
                label: `Edit`,
              })
            );
            console.log("formData::DEBUG", formData);
            if (formData.discountType == "present") {
              formData.price =
                formData.wholeSalePrice *
                (1 - (formData.discountPercent || 0) / 100);
            } else {
              formData.price =
                formData.wholeSalePrice -
                (parseInt(formData.discountCash) || 0);
            }
            console.log(formData.price);
            if (!formData.discountType || formData.discountType == "") {
              formData.discountType = "cash";
            }

            return (
              <Grid container direction="column">
                <Grid item>
                  <SelectInput
                    source="discountType"
                    allowEmpty={false}
                    choices={[
                      { id: "cash", name: "Discount Cash" },
                      { id: "present", name: "Discount Present" },
                    ]}
                  />
                </Grid>
                <Grid item>
                  {" "}
                  {formData.discountType == "present" ? (
                    <NumberInput
                      label="Discount Percent off: "
                      source="discountPercent"
                      validate={[required()]}
                    />
                  ) : (
                      <NumberInput
                        label="Discount Cash"
                        source="discountCash"
                        validate={[required()]}
                      />
                    )}
                </Grid>
                <Grid item>{product && renderBtnGroup(formData)}</Grid>

                <Box maxWidth="25%">
                  <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                      <TableBody>
                        <TableRow key={1}>
                          <TableCell align="left">Wholesale Price</TableCell>

                          <TableCell align="right">
                            {formData.wholeSalePrice}
                          </TableCell>
                        </TableRow>
                        <TableRow key={1}>
                          <TableCell align="left">
                            Discounted Amount(HKD)
                          </TableCell>
                          <TableCell align="right">
                            {`-${Math.round(
                              (formData.wholeSalePrice - formData.price) * 100
                            ) / 100
                              }`}
                          </TableCell>
                        </TableRow>
                        <TableRow key={1}>
                          <TableCell align="left">Price(HKD)</TableCell>

                          <TableCell align="right">
                            {Math.round(formData.price * 100) / 100}
                          </TableCell>
                        </TableRow>
                        <TableRow key={1} color>
                          <TableCell align="left">Total Price(HKD)</TableCell>

                          <TableCell align="right">
                            {Math.round(
                              formData.price * formData.quantity * 100
                            ) / 100}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};
