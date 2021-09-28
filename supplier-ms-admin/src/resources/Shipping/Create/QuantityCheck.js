import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import QuantityCheckForm from './QuantityCheckForm';

function QuantityCheck({ formData, setFormData, setCheckSuccess }) {
  return (
    <Box p={1}>
      <QuantityCheckForm setFormData={setFormData} formData={formData} />
    </Box>
  );
}

QuantityCheck.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default QuantityCheck;
