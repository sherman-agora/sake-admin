import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloProvider as ClientProvider } from "@apollo/client";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";
import { Admin, Resource, Loading } from "react-admin";
import DashboardPage from "./containers/DashboardPage";
import NotFoundPage from "./containers/NotFoundPage/Loadable";
import Layout from "./containers/Layout";
import routes from "./routes";
import { apolloClient, getDataProvider } from "./dataProvider";
import authProvider from "./dataProvider/authProvider";
import {
  WarehouseList,
  WarehouseShow,
  WarehouseCreate,
  WarehouseEdit,
} from "./resources/Warehouse";
import {
  SupplierList,
  SupplierCreate,
  SupplierEdit,
  SupplierShow,
} from "./resources/Supplier";
import {
  ReceivePaymentList,
  ReceivePaymentCreate,
  ReceivePaymentEdit,
  ReceivePaymentShow,
} from "./resources/ReceivePayment";
import {
  DeliveryNoteList,
  DeliveryNoteCreate,
  DeliveryNoteEdit,
  DeliveryNoteShow,
} from "./resources/DeliveryNote";
import { DeliveryItemEdit } from "./resources/DeliveryItem";
import { DeliveryItemCreate } from "./resources/DeliveryItem/Create";

import {
  InvoiceList,
  InvoiceCreate,
  InvoiceEdit,
  InvoiceShow,
} from "./resources/Invoice";
import {
  SalesOrderList,
  SalesOrderCreate,
  SalesOrderEdit,
  SalesOrderShow,
} from "./resources/SalesOrder";
import {
  PurchaseOrderList,
  PurchaseOrderCreate,
  PurchaseOrderEdit,
  PurchaseOrderShow,
} from "./resources/PurchaseOrder";
import {
  ShippingList,
  ShippingCreate,
  ShippingEdit,
  ShippingShow,
} from "./resources/Shipping";
import {
  ProductList,
  ProductCreate,
  ProductEdit,
  ProductShow,
} from "./resources/Product";
import {
  CustomerList,
  CustomerCreate,
  CustomerEdit,
  CustomerShow,
} from "./resources/Customer";
import { UserList, UserCreate, UserEdit, UserShow } from "./resources/User";
import {
  UserGroupList,
  UserGroupCreate,
  UserGroupEdit,
  UserGroupShow,
} from "./resources/UserGroup";
import {
  CustomerGroupList,
  CustomerGroupCreate,
  CustomerGroupEdit,
  CustomerGroupShow,
} from "./resources/CustomerGroup";
import {
  CustomerShopCreate,
  CustomerShopEdit,
  CustomerShopList,
  CustomerShopShow,
} from "./resources/CustomerShop";
import {
  ProductCategoryCreate,
  ProductCategoryEdit,
  ProductCategoryList,
  ProductCategoryShow,
} from "./resources/ProductCategory";
import { i18nProvider } from "./i18nProvider";
import {
  PurchaseOrderItemEdit,
  PurchaseOrderItemCreate,
} from "./resources/PurchaseOrderItem";
import { ShippingItemEdit } from "./resources/ShippingItem";
import {
  SalesOrderItemCreate,
  SalesOrderItemEdit,
} from "./resources/SalesOrderItem";
import { createBrowserHistory as createHistory } from "history";
import breadcrumbReducer from "./redux/breadcrumbs";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f16112",
    },
  },
  sidebar: {
    width: "100%", // The default value is 240
    closedWidth: "100%", // The default value is 55
  },
});
const history = createHistory();

const App = () => {
  const [dataProvider, setDataProvider] = useState();

  useEffect(() => {
    if (!dataProvider) {
      getDataProvider()
        .then((dp) => {
          setDataProvider(() => dp);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [dataProvider, setDataProvider]);

  if (!dataProvider) {
    return <Loading />;
  }

  return (
    <ClientProvider client={apolloClient}>
      <ApolloProvider client={apolloClient}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <Admin
            theme={theme}
            i18nProvider={i18nProvider}
            authProvider={authProvider}
            title="Supplier Management System"
            // dashboard={DashboardPage}
            catchAll={NotFoundPage}
            layout={Layout}
            customRoutes={routes}
            dataProvider={dataProvider}
            history={history}
            customReducers={{ breadcrumb: breadcrumbReducer }}
          >
            <Resource
              name="Warehouse"
              list={WarehouseList}
              edit={WarehouseEdit}
              create={WarehouseCreate}
              show={WarehouseShow}
            />
            <Resource
              name="Supplier"
              list={SupplierList}
              edit={SupplierEdit}
              create={SupplierCreate}
              show={SupplierShow}
            />
            <Resource
              name="ReceivePayment"
              list={ReceivePaymentList}
              create={ReceivePaymentCreate}
              show={ReceivePaymentShow}
            />
            <Resource
              name="DeliveryNote"
              list={DeliveryNoteList}
              edit={DeliveryNoteEdit}
              create={DeliveryNoteCreate}
              show={DeliveryNoteShow}
            />
            <Resource
              name="DeliveryItem"
              edit={DeliveryItemEdit}
              create={DeliveryItemCreate}
            />
            <Resource name="InventoryItem" />
            <Resource name="ExpiryDateSummary" />
            <Resource name="WarehouseSummary" />
            <Resource
              name="Invoice"
              list={InvoiceList}
              edit={InvoiceEdit}
              create={InvoiceCreate}
              show={InvoiceShow}
            />
            <Resource
              name="SalesOrder"
              list={SalesOrderList}
              edit={SalesOrderEdit}
              create={SalesOrderCreate}
              show={SalesOrderShow}
            />
            <Resource
              name="SalesOrderItem"
              edit={SalesOrderItemEdit}
              create={SalesOrderItemCreate}
            />
            <Resource
              name="PurchaseOrder"
              list={PurchaseOrderList}
              edit={PurchaseOrderEdit}
              create={PurchaseOrderCreate}
              show={PurchaseOrderShow}
            />
            <Resource
              name="PurchaseOrderItem"
              edit={PurchaseOrderItemEdit}
              create={PurchaseOrderItemCreate}
            />
            <Resource
              name="Shipping"
              list={ShippingList}
              edit={ShippingEdit}
              create={ShippingCreate}
              show={ShippingShow}
            />
            <Resource name="ShippingItem" edit={ShippingItemEdit} />
            <Resource
              name="Product"
              list={ProductList}
              edit={ProductEdit}
              create={ProductCreate}
              show={ProductShow}
            />
            <Resource
              name="ProductCategory"
              list={ProductCategoryList}
              edit={ProductCategoryEdit}
              create={ProductCategoryCreate}
              show={ProductCategoryShow}
            />
            <Resource
              name="Customer"
              list={CustomerList}
              edit={CustomerEdit}
              create={CustomerCreate}
              show={CustomerShow}
            />
            <Resource
              name="CustomerGroup"
              list={CustomerGroupList}
              edit={CustomerGroupEdit}
              create={CustomerGroupCreate}
              show={CustomerGroupShow}
            />
            <Resource
              name="CustomerShop"
              list={CustomerShopList}
              edit={CustomerShopEdit}
              create={CustomerShopCreate}
              show={CustomerShopShow}
            />
            <Resource
              name="User"
              list={UserList}
              edit={UserEdit}
              create={UserCreate}
              show={UserShow}
            />
            <Resource
              name="UserGroup"
              list={UserGroupList}
              edit={UserGroupEdit}
              create={UserGroupCreate}
              show={UserGroupShow}
            />
            <Resource name="CustomerCoupon" />
          </Admin>
        </MuiPickersUtilsProvider>
      </ApolloProvider>
    </ClientProvider>
  );
};

export default App;
