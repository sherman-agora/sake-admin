import React from 'react';
import { NumberField } from 'react-admin';
import dayjs from 'dayjs';

export function handleExpectedSales({ monthlySalesOnAverage }, expectedSalesDate) {
  const monthDiff = dayjs(expectedSalesDate).diff(dayjs(), 'month');
  const expectedSales = monthlySalesOnAverage * (monthDiff) * 1.05
  if (Math.floor(expectedSales) < 0) {
    return 0
  } else {
    return Math.floor(expectedSales).toFixed(1);
  }
}

export default ({ label, record, options }) => {
  const value = handleExpectedSales(record, options.expectedSalesDate);

  return (
    <NumberField label={label} record={{ value }} source="value" />
  )
}
