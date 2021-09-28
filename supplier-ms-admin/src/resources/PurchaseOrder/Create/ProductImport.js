import React from "react";
import { NumberField, useNotify } from "react-admin";
import CSVReader from "react-csv-reader";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import csvTemplate from "./template.csv";
import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@material-ui/core";
import BilingualField from "../../../components/BilingualField";

const GET_PRODUCTS = gql`
  query {
    products {
      id
      code
      nameChi
      nameEn
      minOrderQuantity
      quantity
      minStockLevel
      cost
      wholeSalePrice1
      wholeSalePrice2
      wholeSalePrice3
      wholeSalePrice4
      wholeSalePrice5
    }
  }
`;

const ProductImport = ({ formData, setFormData }) => {
  const notify = useNotify();
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const { data } = useQuery(GET_PRODUCTS);
  const importSuccess = async (arr) => {
    try {
      arr.shift();
      const backendData = data.products.reduce((results, row) => {
        results[row.code] = row;
        return results;
      }, {});
      const products = arr
        .filter((row) => {
          const code = row[1] && row[1] !== "" && row[1].replace(/-/g, "");
          return row[0] !== "" && row[1] !== "" && backendData[code];
        })
        .map((row) => {
          const code = row[1].replace(/-/g, "");
          let quantity;
          if (row[3].includes("/") === true) {
            quantity = parseInt(row[0]) * parseInt(row[3].split("/"[0]));
          } else {
            quantity = row[0];
          }
          const price = parseFloat(backendData[code].cost);
          return {
            ...backendData[code],
            quantity,
            price,
            totalPrice: quantity * price,
          };
        });
      notify(`Imported ${products.length} Products`);
      setFormData({
        ...formData,
        products,
      });
    } catch (error) {
      notify(`Error: ${error}.`, "warning");
    }
  };
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <React.Fragment>
      <CSVReader onFileLoaded={(data) => importSuccess(data)} label="Select .csv file  " />
      <a href={csvTemplate} target="_blank">
        Template
      </a>
      {formData.products && formData.products.length > 0 && (
        <Paper>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Product no.</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Cost</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.item}>
                    <TableCell align="right">{row.code}</TableCell>
                    <TableCell align="right">
                      <BilingualField source="name" record={row} />
                    </TableCell>
                    <TableCell align="right">
                      <NumberField source="price" record={row} options={{ style: "currency", currency: "HKD" }} />
                    </TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">
                      <NumberField source="totalPrice" record={row} options={{ style: "currency", currency: "HKD" }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={formData.products.length} rowsPerPage={rowsPerPage} page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} />
        </Paper>
      )}
    </React.Fragment>
  );
};

export default ProductImport;
