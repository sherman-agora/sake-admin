import React, { useState } from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Add, Remove } from "@material-ui/icons";
import ProductListHeader from "./ProductListHeader";
import ProductListPagination from "./ProductListPagination";
import ProductListToolbar from "./ProductListToolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ProductSelectModal from "./ProductSelectModal";

const GET_PRODUCTS = gql`
  query getProducts(
    $where: ProductWhereInput
    $orderBy: ProductOrderByInput
    $first: Int
    $skip: Int
  ) {
    productsConnection(
      where: $where
      orderBy: $orderBy
      skip: $skip
      first: $first
    ) {
      edges {
        node {
          id
          code
          nameChi
          nameEn
          minOrderQuantity
          minStockLevel
          quantity
          discount
          cost
          wholeSalePrice1
          wholeSalePrice2
          wholeSalePrice3
          wholeSalePrice4
          wholeSalePrice5
        }
      }
      aggregate {
        count
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {},
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  image: {
    width: 60,
    height: 60,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

function ProductSelector({ selected, onSelected, customer }) {
  const classes = useStyles();
  const [where, setWhere] = useState({});
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("id_ASC");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: {
      where,
      orderBy,
      first: rowsPerPage,
      skip: page * rowsPerPage,
    },
  });
  if (error) {
    return <div>Error</div>;
  }
  if (!data && loading) {
    return <div>loading...</div>;
  }
  const rows = data.productsConnection.edges.map((e) => e.node);
  const totalRows = data.productsConnection.aggregate.count;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, totalRows - page * rowsPerPage);
  const selectedIds = selected.map((s) => s.id);

  const handleSelected = (product, selected) => {
    onSelected(product, selected);
  };

  const createToggleProduct = (product) => () => {
    const selected = !selectedIds.includes(product.id);
    if (!selected) {
      handleSelected(product, selected);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleProductAdd = (product) => {
    handleSelected(product, true);
    setSelectedProduct(null);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

  return (
    <React.Fragment>
      <ProductListToolbar where={where} setWhere={setWhere} />

      <Table className={classes.table} aria-label="custom pagination table">
        <ProductListHeader onSort={setOrderBy} />
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <IconButton onClick={createToggleProduct(row)}>
                  {selectedIds.includes(row.id) ? <Remove /> : <Add />}
                </IconButton>
              </TableCell>
              <TableCell>{row.code}</TableCell>
              <TableCell component="th" scope="row">
                <Grid container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography variant="subtitle1" gutterBottom>
                      {row.nameChi}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {row.nameEn}
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="right">{parseInt(row.quantity, 10)}</TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <ProductListPagination
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Table>
      <ProductSelectModal
        product={selectedProduct}
        open={!!selectedProduct}
        onSubmit={handleProductAdd}
        onCancel={handleClose}
        customer={customer}
      />
    </React.Fragment>
  );
}

ProductSelector.propTypes = {
  selected: PropTypes.array.isRequired,
  onSelected: PropTypes.func.isRequired,
};

export default ProductSelector;
