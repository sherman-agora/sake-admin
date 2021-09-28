import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const BilingualField = ({ source, record = {}, label }) => {
  return (
    <Typography variant="body1">
      {record[`${source}Chi`]}<br/>
      {record[`${source}En`]}
    </Typography>
  );
}

BilingualField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
};

export default BilingualField;