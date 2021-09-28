import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';

const genData = count =>
  [...Array(count).keys()].map(i => {
    const id = (Math.random() * 900000 + 1000000).toFixed();
    const size = (Math.random() * 10).toFixed();
    const quantity = (i + Math.random() * 5).toFixed();
    return {
      id: `#${id}`,
      desc: `ABC ${size}lb`,
      quantity: `${quantity}%`,
      percentage: quantity,
    };
  });

export default function ProductForm() {
  const [num, setNum] = useState(10);

  const products = genData(num);

  const handleAdd = () => {
    setNum(num + 1);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Select Products
      </Typography>
      <Grid container spacing={3}>
        {products.map(product => (
          <React.Fragment key={product.id}>
            <Grid container item xs={12} sm={9}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  {product.id} - {product.desc}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <LinearProgress
                  variant="buffer"
                  value={product.percentage}
                  valueBuffer={parseInt(product.percentage, 10) + 10}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                id="quantity"
                name="quantity"
                label="Quantity"
                fullWidth
                autoComplete="quantity"
                value={20}
              />
            </Grid>
            <Divider />
          </React.Fragment>
        ))}
        <Button color="primary" onClick={handleAdd}>
          <AddIcon />
          Add
        </Button>
      </Grid>
    </React.Fragment>
  );
}
