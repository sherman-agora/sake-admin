import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import dayjs from "dayjs";
import { NumberField, useTranslate } from "react-admin";
import {
  TableContainer,
  Paper,
  TablePagination,
  TableBody,
  TableCell,
  TableHead,
  Table,
  Grid,
  TableRow,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import BilingualField from "../../../components/BilingualField";
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_SUPPLIER_PO = gql`
  query getPo($where: PurchaseOrderWhereInput!) {
    purchaseOrders(where: $where) {
      totalPrice
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  label: {
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: theme.spacing(2),
  },
}));

function Review({ formData, setFormData }) {
  let end = dayjs().add(1, "month").format('YYYY-MM-DD').toString();
  let start = dayjs().format('YYYY-MM-DD').toString();

  const { loading: loadingPO, data: supplierPO } = useQuery(GET_SUPPLIER_PO, {
    variables: {
      where: {
        createdAt_gt: `${start.substring(0, 7)}`,
        createdAt_lt: `${end.substring(0, 7)}`,
        supplierId: formData.supplier.id,
      },
    },
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const translate = useTranslate();
  const classes = useStyles();
  let supplierLine = 0;

  const grandTotal = formData.products.reduce(
    (results, product) => results + product.price * product.quantity,
    0
  );
  useEffect(() => {
    if (loadingPO) {
      console.log('loadingPO')
    }
    if (!supplierPO) {
      console.log('error loading supplierPO', supplierPO)
    }
  }, [supplierPO, loadingPO]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {translate("purchaseOrder.purchaseOrderDetails")}
      </Typography>
      <Grid container>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("purchaseOrder.code")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.code}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("purchaseOrder.supplier")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.supplier.name}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            line
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.supplier.creditLine}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("purchaseOrder.expectedDeliveryAt")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>
            {dayjs(formData.expectedDeliveryAt).format("YYYY-MM-DD")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom className={classes.label}>
            {translate("purchaseOrder.state")}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography gutterBottom>{formData.state}</Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    Details
                  </TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Desc</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.products &&
                  formData.products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => {
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <BilingualField source="name" record={product} />
                          </TableCell>
                          <TableCell align="right">
                            <NumberField
                              source="price"
                              record={product}
                              options={{ style: "currency", currency: "HKD" }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {product.quantity}
                          </TableCell>
                          <TableCell align="right">
                            <NumberField
                              source="totalPrice"
                              record={product}
                              options={{ style: "currency", currency: "HKD" }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell align="right">
                    <NumberField
                      source="grandTotal"
                      record={{ grandTotal }}
                      options={{ style: "currency", currency: "HKD" }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={formData.products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Review;
