import React from 'react';
import { Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import { FormDataConsumer, Datagrid, ReferenceField, DateField, TextField, useTranslate, NumberField } from 'react-admin';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import BilingualField from '../../../components/BilingualField';
import ShowText from '../../../components/Shows/ShowText';

function Review({ formProps }) {
  const translate = useTranslate();
  console.log(formProps);

  return (
    <FormDataConsumer subscription={{ values: true }}>
      {({ formData }) => {
        const { invoiceId, salesOrderId, customerId, items } = formData;
        const record = formData.items.reduce((r, i) => {
          r[i.itemId] = i;
          return r;
        }, {});
        return (
          <React.Fragment>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ShowText label={translate('customer.shippingAddress')}>
                <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="salesOrderId" reference="SalesOrder" 
                    record={formData}
                    link={false}
                 >
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="shop.id"
                    reference="CustomerShop"
                    record={formData}
                    link={false}
                  >
                    
                    <TextField source="deliverAddress" />
                  </ReferenceField>
                 </ReferenceField>
                </ShowText>
                <ShowText label="Attn.">
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="salesOrderId" reference="SalesOrder" 
                    record={formData}
                    link={false}
                 >
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="shop.id"
                    reference="CustomerShop"
                    record={formData}
                    link={false}
                  >
                    <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="customer.id"
                    reference="Customer"
                    record={formData}
                    link={false}
                  >
                    <TextField source="nameChi" />
                  </ReferenceField>
                  </ReferenceField>
                 </ReferenceField>
                </ShowText>
                <ShowText label="Tel..">
                <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="salesOrderId" reference="SalesOrder" 
                    record={formData}
                    link={false}
                 >
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="shop.id"
                    reference="CustomerShop"
                    record={formData}
                    link={false}
                  >
                    <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="customer.id"
                    reference="Customer"
                    record={formData}
                    link={false}
                  >
                    <TextField source="mobile" />
                  </ReferenceField>
                  </ReferenceField>
                 </ReferenceField>
                </ShowText>
                <ShowText label={translate('customer.billingAddress')}>
                <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="salesOrderId" reference="SalesOrder" 
                    record={formData}
                    link={false}
                 >
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="shop.id"
                    reference="CustomerShop"
                    record={formData}
                    link={false}
                  >
                    <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="customer.id"
                    reference="Customer"
                    record={formData}
                    link={false}
                  >
                    <TextField source="billingAddress" />
                  </ReferenceField>
                  </ReferenceField>
                 </ReferenceField>
                </ShowText>
                <ShowText label="Attn.">
                <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="salesOrderId" reference="SalesOrder" 
                    record={formData}
                    link={false}
                 >
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="shop.id"
                    reference="CustomerShop"
                    record={formData}
                    link={false}
                  >
                    <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="customer.id"
                    reference="Customer"
                    record={formData}
                    link={false}
                  >
                    <TextField source="nameChi" />
                  </ReferenceField>
                  </ReferenceField>
                 </ReferenceField>
                </ShowText>
                <ShowText label="Tel..">
                <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="salesOrderId" reference="SalesOrder" 
                    record={formData}
                    link={false}
                 >
                 <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="shop.id"
                    reference="CustomerShop"
                    record={formData}
                    link={false}
                  >
                    <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="customer.id"
                    reference="Customer"
                    record={formData}
                    link={false}
                  >
                    <TextField source="mobile" />
                  </ReferenceField>
                  </ReferenceField>
                 </ReferenceField>
                </ShowText>
              </Grid>
              <Grid item xs={6}>
                <ShowText label={translate('common.date')}>
                  {dayjs().format('YYYY-MM-DD')}
                </ShowText>
                <ShowText label="Ref.">
                  <ReferenceField
                    resource="DeliveryNote"
                    basePath="/DeliveryNote"
                    source="invoiceId"
                    reference="Invoice"
                    record={formData}
                    link={false}
                  >
                    <TextField source="code" label="Delivery Note No." />
                  </ReferenceField>
                </ShowText>
                <ShowText label={translate('deliveryNote.deliveryDate')}>
                  <TextField source="deliveryDate" record={formData} />
                </ShowText>
                <ShowText label={translate('common.salesman')}>
                  Jacky Lee
                </ShowText>
              </Grid>
              <Grid item xs={12}>
                <Datagrid
                  data={record}
                  ids={Object.keys(record)}
                  resource="DeliveryNote"
                  basePath="/DeliveryNote"
                  currentSort={{ field: 'code', order: 'ASC' }}
                >
                  <TextField source="productCode" />
                  <BilingualField source="productName" />
                  <NumberField source="label" />
                  <DateField source="expiryDate" />
                  <TextField label="Box Num" source="boxNum" />
                </Datagrid>
              </Grid>
            </Grid>
          </React.Fragment>
        );
      }}
    </FormDataConsumer>
  );
}

export default Review;