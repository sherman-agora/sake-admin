import React from 'react';
import {
    Create,
    Edit,
    SimpleForm,
    List,
    Datagrid,
    Show,
    SimpleShowLayout,

    CloneButton,
    EditButton,
    DeleteButton,

    TextField,
    EmailField,
    DateField,
    ImageField,
    ReferenceField,

    TextInput,
    NumberInput,
    ImageInput,
    DateInput,
    ReferenceInput,
    SelectInput,

    required,
    email
} from 'react-admin';
const redirect = () => '/PurchaseOrder';
export const PurchaseOrderCreate = props => (
    <Create {...props}>
        <SimpleForm redirect={redirect}>
            <TextInput source="name" validate={required()} />
            <TextInput source="email" validate={email()} />
            <TextInput source="country" />
            <TextInput source="phone" />
            <TextInput source="fax" />
            <TextInput source="email" />
            <TextInput multiline source="paymentTerms" />
            <TextInput multiline source="Line" />
        </SimpleForm>
    </Create>
);