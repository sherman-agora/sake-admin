import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SaveButton, Toolbar, useCreate, useNotify, Create, SimpleForm, AutocompleteInput, NumberInput, ReferenceInput, SelectInput, Edit, FormDataConsumer, useTranslate } from 'react-admin';
import { useFormState } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { addBreadcrumbs } from '../../../redux/breadcrumbs';
import { Grid } from '@material-ui/core';
import ShowText from "../../../components/Shows/ShowText";
import ItemAutocomplete from "../../DeliveryNote/Create/ItemAutocomplete";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const CREATE_DELIVERY_ITEM = gql`
    mutation createDeliveryItem($data: DeliveryItemCreateInput!) {
        createDeliveryItem(data: $data) {
        id
      }
    }
  `;

const SaveItemButton = (props) => {
    const [createDeliveryItem] = useMutation(CREATE_DELIVERY_ITEM);
    const [create] = useCreate('DeliveryItem');
    const history = useHistory();
    const notify = useNotify();
    const formState = useFormState();

    const redirect = () => {
        return history.go(-1);
    };

    const handleClick = useCallback(() => {
        if (!formState.valid) {
            return;
        }
        const { product, boxNum, DeliveryNote, itemId, label, ...formValues } = formState.values;
        createDeliveryItem({
            variables: {
                data: {
                    deliveryNote: {
                        connect: {
                            id: DeliveryNote.id
                        }
                    },
                    productId: product.id,
                    itemId,
                    boxNum
                }
            }
        })
            .then((value) => {
                console.log("res", value);
                notify(`Save Success.`);
                redirect()
            })
            .catch((error) => {
                notify(`Error: ${error.message}`, "warning");
            });

        // create(
        //     {
        //         payload: {
        //             data: {
        //                 deliveryNote: {
        //                     connect: {
        //                         id: DeliveryNote.id
        //                     }
        //                 },
        //                 productId: product.id,
        //                 itemId: itemId,
        //                 boxNum: boxNum
        //             },
        //         },
        //     },
        //     {
        //         onSuccess: ({ data: newRecord }) => {
        //             notify('ra.notification.created', 'info', {
        //                 smart_count: 1,
        //             });
        //             redirect();
        //         },
        //     }
        // );
    }, [formState.valid, formState.values, create, notify, redirect]);

    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

const DeliveryItemCreateToolbar = (props) => (
    <Toolbar {...props}>
        <SaveItemButton label="common.save" submitOnEnter={false} variant="text" />
    </Toolbar>
);

export function DeliveryItemCreate(props) {
    const [selectedProduct, setSelectedProduct] = useState();
    const dispatch = useDispatch();

    dispatch(addBreadcrumbs({ url: '/DeliveryItem/create', label: 'Add New Delivery Item' }));

    const searchProduct = (searchText) => ({
        code_contains: searchText,
    });

    const inputText = (record) => () => {
        setSelectedProduct(record);
        return `${record.code} ${record.nameChi}`;
    };
    const handleChange = (formData) => (inventoryItem) => {
        formData.itemId = inventoryItem.id
        formData.label = inventoryItem.label
    }

    const OptionRenderer = (choice) => `${choice.record.code} ${choice.record.nameChi}`;

    const renderInput = () => {
        return (
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    formData.quantity = selectedProduct.quantity;
                    formData.price = selectedProduct.cost;
                    const tempProduct = {
                        id: selectedProduct.id,
                        quantity: selectedProduct.quantity,
                        product: {
                            id: selectedProduct.id,
                            code: selectedProduct.code
                        }
                    }
                    return (
                        <Grid container direction="column" style={{ width: 280 }}>
                            <ShowText label="Select lable">
                                <ItemAutocomplete onChange={handleChange(formData)} placeholder="Label" products={[tempProduct]} />
                            </ShowText>
                            <NumberInput source="boxNum" label="boxNum" />
                        </Grid>
                    );
                }}
            </FormDataConsumer>
        );
    };


    return (
        <Create {...props}>
            <SimpleForm toolbar={<DeliveryItemCreateToolbar />} variant="standard">
                <ReferenceInput label="DeliveryNote" source="DeliveryNote.id" reference="DeliveryNote">
                    <SelectInput disabled optionText="id" label="DeliveryNote No." />
                </ReferenceInput>
                <ReferenceInput filterToQuery={searchProduct} label="Product" source="product.id" reference="Product">
                    <AutocompleteInput optionText={<OptionRenderer />} label="DeliveryNote" inputText={inputText} matchSuggestion={(filterValue, suggestion) => true} options={{ style: { width: 500 } }} />
                </ReferenceInput>
                {selectedProduct && renderInput()}
            </SimpleForm>
        </Create>
    );
}