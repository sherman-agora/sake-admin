import React from 'react';
import { NumberField } from 'react-admin';
import dayjs from 'dayjs';

export default ({ label, options }) => {
  const value = dayjs(options.expectedSalesDate).diff(dayjs(), 'month');

  return (
    <NumberField label={label} record={{ value }} source="value" />
  )
}
