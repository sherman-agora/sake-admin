import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { DatePicker } from "@material-ui/pickers";
import { Search } from "@material-ui/icons";
import jsonExport from "jsonexport/dist";
import { Edit } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import dayjs from "dayjs";
import {
  NumberField,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  TextField,
  downloadCSV,
  ReferenceField,
  Filter,
  TextInput,
  usePermissions,
} from "react-admin";
import BilingualField from "../../components/BilingualField";
import ExpectedQuantityField, {
  handleExpectedSales,
} from "./ExpectedQuantityField";
import MonthDiffField from "./MonthDiffField";
import { Grid, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/breadcrumbs";

const breadcrumbBase = { url: "/Inventory", label: "Inventory" };
function Inventory({ staticContext, ...props }) {
  const { permissions } = usePermissions();
  const [expectedSalesDate, setExpectedSalesDate] = useState(
    dayjs().add(4, "month")
  );
  const history = useHistory();
  const dispatch = useDispatch();
  dispatch(setBreadcrumbs([breadcrumbBase]));
  const exporter = (products) => {
    const postsForExport = products.map((product) => {
      const {
        code,
        nameChi,
        quantity,
        monthlySalesOnAverage,
        incomingQuantity,
      } = product; // omit backlinks and author
      return {
        code,
        name: nameChi,
        stock: quantity,
        avg: monthlySalesOnAverage,
        incoming: incomingQuantity,
        nextShipment: dayjs(expectedSalesDate).diff(dayjs(), "month"),
        expectedSales: handleExpectedSales(product, expectedSalesDate),
      };
    });
    jsonExport(
      postsForExport,
      {
        headers: [
          "code",
          "name",
          "stock",
          "avg",
          "incoming",
          "nextShipment",
          "expectedSales",
        ], // order fields in the export
      },
      (err, csv) => {
        downloadCSV(csv, "posts"); // download as 'posts.csv` file
      }
    );
  };

  const toEdit = () => (id) => {
    history.push(`/Inventory/${id}/editStock`);
  };

  const SearchFilter = (props) => (
    <Filter {...props}>
      <TextInput
        label="Search Product no."
        source="code_starts_with"
        alwaysOn={false}
      ></TextInput>
    </Filter>
  );
  const StatusEditButton = ({ record, props, permissions }) =>
    permissions === "admin" ? (
      <EditButton basePath={`/Inventory/editStock`} record={record} />
    ) : null;

  return (
    <React.Fragment>
      <List
        resource="Product"
        hasCreate={false}
        hasEdit={false}
        hasShow={false}
        hasList={true}
        basePath="/Inventory"
        exporter={exporter}
        {...props}
        filters={<SearchFilter />}
      >
        <Datagrid>
          <ReferenceField
            label="Product No."
            source="id"
            reference="Product"
            link={(product, reference) => `/${reference}/${product.id}/show`}
          >
            <TextField source="code" />
          </ReferenceField>
          <ReferenceField
            label="name"
            source="id"
            reference="Product"
            link={(product, reference) => `/${reference}/${product.id}/show`}
          >
            <BilingualField source="name" />
          </ReferenceField>
          <NumberField label="Stock" source="quantity" sortable={false} />
          <FunctionField
            render={(record) => (
              <StatusEditButton
                record={record}
                props={props}
                permissions={permissions}
              />
            )}
            sortable={false}
          />
          <NumberField source="monthlySalesOnAverage" sortable={false} />
          <NumberField source="outgoingQuantity" sortable={false} />
          <NumberField source="incomingQuantity" sortable={false} />
          <MonthDiffField
            label="Months till Next shipment"
            options={{ expectedSalesDate }}
            sortable={false}
          />
          <ExpectedQuantityField
            label="Expected Sales till next shipment"
            options={{ expectedSalesDate }}
            sortable={false}
          />
        </Datagrid>
      </List>
      <Grid container justify="flex-end" alignItems="center">
        <Typography variant="button">
          Expected next shipment month and default after 4 month :{" "}
        </Typography>
        <DatePicker
          style={{ width: 200, margin: 10 }}
          inputVariant="filled"
          value={expectedSalesDate}
          openTo="year"
          views={["year", "month"]}
          onChange={setExpectedSalesDate}
        />
      </Grid>
    </React.Fragment>
  );
}

export default Inventory;
