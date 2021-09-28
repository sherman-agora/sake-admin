/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState } from "react";
import { usePermissions, Loading } from "react-admin";
import { WidthProvider, Responsive } from "react-grid-layout";
import { makeStyles } from "@material-ui/core/styles";
import ProfitChart from "./boards/ProfitChart";
import ProfitNumSum from "./boards/ProfitNumSum";
import PurchasingForecast from "./boards/PurchasingForecast";
import SalesOrderChart from "./boards/SalesOrderChart";
import SalesOrderNumSum from "./boards/SalesOrderNumSum";
import SalesOrderRecent from "./boards/SalesOrderRecent";
import PurchaseOrderRecent from "./boards/PurchaseOrderRecent";
import DeliveryNoteWaiting from "./boards/DeliveryNoteWaiting";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}

const originalLayouts = getFromLS("layouts") || {};
export default function DashboardPage() {
  const { loaded, permissions } = usePermissions();
  const [layouts, setLayouts] = useState(originalLayouts);
  const onLayoutChange = (layout, layouts) => {
    saveToLS("layouts", layouts);
    setLayouts(layouts);
  };
  if (!loaded) return <Loading />;

  const renderProfitChart = () => {
    if (["admin", "account"].includes(permissions)) {
      return (
        <div key="profitChart" data-grid={{ w: 8, h: 10, x: 0, y: 0, minW: 4, minH: 10 }}>
          <ProfitChart />
        </div>
      );
    }
  };

  const renderProfitNumSum = () => {
    if (["admin", "account"].includes(permissions)) {
      return (
        <div key="profitNumSum" data-grid={{ w: 4, h: 10, x: 8, y: 0, minW: 2, minH: 10 }}>
          <ProfitNumSum />
        </div>
      );
    }
  };

  const renderPurchasingForecast = () => {
    if (["admin"].includes(permissions)) {
      return (
        <div key="purchasingForecast" data-grid={{ w: 12, h: 10, x: 0, y: 10, minW: 4, minH: 10 }}>
          <PurchasingForecast />
        </div>
      );
    }
  };

  const renderSalesOrderChart = () => {
    if (["admin", "account", "sales"].includes(permissions)) {
      return (
        <div key="salesOrderChart" data-grid={{ w: 8, h: 10, x: 0, y: 0, minW: 4, minH: 10 }}>
          <SalesOrderChart />
        </div>
      );
    }
  };

  const renderSalesOrderNumSum = () => {
    if (["admin", "account", "sales"].includes(permissions)) {
      return (
        <div key="salesOrderNumSum" data-grid={{ w: 4, h: 10, x: 8, y: 0, minW: 2, minH: 10 }}>
          <SalesOrderNumSum />
        </div>
      );
    }
  };

  const renderSalesOrderRecent = () => {
    if (["admin", "account", "sales"].includes(permissions)) {
      return (
        <div key="salesOrderRecent" data-grid={{ w: 12, h: 10, x: 0, y: 10, minW: 4, minH: 10 }}>
          <SalesOrderRecent />
        </div>
      );
    }
  };

  const renderPurchaseOrderRecent = () => {
    if (["admin", "account"].includes(permissions)) {
      return (
        <div key="purchaseOrderRecent" data-grid={{ w: 12, h: 10, x: 0, y: 10, minW: 4, minH: 10 }}>
          <PurchaseOrderRecent />
        </div>
      );
    }
  };

  const renderDeliveryNoteWaiting = () => {
    if (["admin", "inventory"].includes(permissions)) {
      return (
        <div key="deliveryNoteWaiting" data-grid={{ w: 12, h: 10, x: 0, y: 10, minW: 4, minH: 10 }}>
          <DeliveryNoteWaiting />
        </div>
      );
    }
  };

  const dashboards = [renderProfitChart(), renderProfitNumSum(), renderPurchasingForecast(), renderSalesOrderChart(), renderSalesOrderNumSum(), renderSalesOrderRecent(), renderPurchaseOrderRecent(), renderDeliveryNoteWaiting()].filter(Boolean);

  return (
    <ResponsiveReactGridLayout className="layout" layouts={layouts} cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }} rowHeight={30} onLayoutChange={onLayoutChange}>
      {dashboards}
    </ResponsiveReactGridLayout>
  );
}
