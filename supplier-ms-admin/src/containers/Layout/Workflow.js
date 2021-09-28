// in src/Menu.js
import React from "react";
import { useSelector } from "react-redux";
import pluralize from "pluralize";
import { withRouter } from "react-router-dom";
import { Workflow, WorkflowItem } from "@tsunadon/supplier-ms-react-workflow";

const Menu = ({ location, history }) => {
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const paths = location.pathname.split("/");
  const isActive = (type) =>
    paths.length > 1 && pluralize.singular(paths[1]) === type;
  const handleClick = (type) => () => history.push(`/${type}`);
  if (!open) return null;
  return (
    <Workflow open>
      <WorkflowItem.Supplier
        onClick={handleClick("Supplier")}
        active={isActive("Supplier")}
      />
      <WorkflowItem.PurchaseOrder
        onClick={handleClick("PurchaseOrder")}
        active={isActive("PurchaseOrder")}
      />
      <WorkflowItem.Shipping
        onClick={handleClick("Shipping")}
        active={isActive("Shipping")}
      />
      <WorkflowItem.Inventory
        onClick={handleClick("Inventory")}
        active={isActive("Inventory")}
      />
      <WorkflowItem.SalesOrder
        onClick={handleClick("SalesOrder")}
        active={isActive("SalesOrder")}
      />
      <WorkflowItem.Invoice
        onClick={handleClick("Invoice")}
        active={isActive("Invoice")}
      />
      <WorkflowItem.DeliveryNote
        onClick={handleClick("DeliveryNote")}
        active={isActive("DeliveryNote")}
      />
      <WorkflowItem.Customer
        onClick={handleClick("Customer")}
        active={isActive("Customer")}
      />
      <WorkflowItem.ReceivePayment
        onClick={handleClick("ReceivePayment")}
        active={isActive("ReceivePayment")}
      />
      <WorkflowItem.Report
        onClick={handleClick("Report")}
        active={isActive("Report")}
      />
    </Workflow>
  );
};

export default withRouter(Menu);
