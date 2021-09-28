// in src/customRoutes.js
import React from "react";
import { Route } from "react-router-dom";
import MonthlyReportPage from "./containers/MonthlyReportPage/Loadable";
import QuarterReportPage from "./containers/QuarterReportPage/Loadable";
import AnnualReportPage from "./containers/AnnualReportPage/Loadable";
import StockTransfer from "./containers/StockTransfer";
import StockDispose from "./containers/StockDispose";
import Labelling from "./containers/Labelling";
import Inventory from "./containers/Inventory";
import AddStock from "./containers/Inventory/AddStock";
import Xero from "./containers/Xero";
import XeroCallback from "./containers/Xero/callback";
import DeliveryItemDelete from "./containers/DeliveryItem";

export default [
  // <Route exact path="/" component={Inventory} />,
  <Route exact path="/Report" component={MonthlyReportPage} />,
  <Route exact path="/Report/quarter" component={QuarterReportPage} />,
  <Route exact path="/Report/annual" component={AnnualReportPage} />,
  <Route exact path="/Inventory" component={Inventory} />,
  <Route exact path="/Inventory/:productId" component={StockTransfer} />,
  <Route exact path="/Inventory/editStock/:productId/" component={AddStock} />,
  <Route exact path="/Inventory/Item/:itemId" component={StockTransfer} />,
  <Route exact path="/Inventory/Labelling" component={Labelling} />,
  <Route exact path="/Inventory/StockDispose" component={StockDispose} />,
  <Route exact path="/Xero" component={Xero} />,
  <Route exact path="/Callback" component={XeroCallback} />,
  <Route
    exact
    path="/DeliveryItem/:deliveryNoteId/delete"
    component={DeliveryItemDelete}
  />,
];
